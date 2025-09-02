from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import time
import json
import os
from datetime import datetime

class MetricData(BaseModel):
    """Model for system metrics data"""
    timestamp: float
    metric_name: str
    value: float
    tags: Dict[str, str] = {}

class SearchMetrics(BaseModel):
    """Model for search-specific metrics"""
    query_count: int = 0
    average_response_time: float = 0.0
    success_rate: float = 1.0
    personalization_rate: float = 0.0

class AgentMetrics(BaseModel):
    """Model for agent-specific metrics"""
    agent_id: str
    process_count: int = 0
    average_processing_time: float = 0.0
    error_count: int = 0

class MetricsService:
    """Service for tracking and evaluating system metrics"""
    
    def __init__(self, metrics_file: str = "metrics.json"):
        self.metrics_file = metrics_file
        self.metrics_buffer: List[MetricData] = []
        self.search_metrics = SearchMetrics()
        self.agent_metrics: Dict[str, AgentMetrics] = {}
        self._load_metrics()
        
    def _load_metrics(self):
        """Load metrics from file"""
        if os.path.exists(self.metrics_file):
            try:
                with open(self.metrics_file, 'r') as f:
                    data = json.load(f)
                    # Load search metrics
                    if 'search_metrics' in data:
                        self.search_metrics = SearchMetrics(**data['search_metrics'])
                    # Load agent metrics
                    if 'agent_metrics' in data:
                        self.agent_metrics = {
                            agent_id: AgentMetrics(**metrics) 
                            for agent_id, metrics in data['agent_metrics'].items()
                        }
            except Exception as e:
                print(f"Error loading metrics: {e}")
                
    def _save_metrics(self):
        """Save metrics to file"""
        try:
            data = {
                'search_metrics': self.search_metrics.dict(),
                'agent_metrics': {agent_id: metrics.dict() for agent_id, metrics in self.agent_metrics.items()},
                'last_updated': time.time()
            }
            with open(self.metrics_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving metrics: {e}")
            
    def record_metric(self, metric_name: str, value: float, tags: Dict[str, str] = {}):
        """Record a metric"""
        metric = MetricData(
            timestamp=time.time(),
            metric_name=metric_name,
            value=value,
            tags=tags
        )
        self.metrics_buffer.append(metric)
        
    def record_search_query(self, response_time: float, success: bool = True):
        """Record search query metrics"""
        self.search_metrics.query_count += 1
        
        # Update average response time
        current_avg = self.search_metrics.average_response_time
        query_count = self.search_metrics.query_count
        self.search_metrics.average_response_time = (
            (current_avg * (query_count - 1) + response_time) / query_count
        )
        
        # Update success rate
        if not success:
            current_success_count = self.search_metrics.success_rate * (query_count - 1)
            self.search_metrics.success_rate = current_success_count / query_count
        else:
            current_success_count = self.search_metrics.success_rate * (query_count - 1) + 1
            self.search_metrics.success_rate = current_success_count / query_count
            
        # Record the metric
        self.record_metric("search_response_time", response_time, {"type": "search"})
        
    def record_agent_processing(self, agent_id: str, processing_time: float, success: bool = True):
        """Record agent processing metrics"""
        if agent_id not in self.agent_metrics:
            self.agent_metrics[agent_id] = AgentMetrics(agent_id=agent_id)
            
        agent_metric = self.agent_metrics[agent_id]
        agent_metric.process_count += 1
        
        # Update average processing time
        current_avg = agent_metric.average_processing_time
        process_count = agent_metric.process_count
        agent_metric.average_processing_time = (
            (current_avg * (process_count - 1) + processing_time) / process_count
        )
        
        # Update error count
        if not success:
            agent_metric.error_count += 1
            
        # Record the metric
        self.record_metric(
            "agent_processing_time", 
            processing_time, 
            {"agent_id": agent_id, "success": str(success)}
        )
        
    def record_personalization(self, personalized: bool):
        """Record personalization metrics"""
        if personalized:
            # Update personalization rate
            current_rate = self.search_metrics.personalization_rate
            query_count = self.search_metrics.query_count
            if query_count > 0:
                self.search_metrics.personalization_rate = (
                    (current_rate * (query_count - 1) + 1) / query_count
                )
                
        self.record_metric("personalization_used", 1.0 if personalized else 0.0)
        
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get a summary of all metrics"""
        return {
            "search_metrics": self.search_metrics.dict(),
            "agent_metrics": {agent_id: metrics.dict() for agent_id, metrics in self.agent_metrics.items()},
            "buffer_size": len(self.metrics_buffer),
            "last_updated": datetime.now().isoformat()
        }
        
    def flush_metrics(self):
        """Flush metrics to persistent storage"""
        self._save_metrics()
        self.metrics_buffer.clear()

# Global instance of the metrics service
metrics_service = MetricsService()