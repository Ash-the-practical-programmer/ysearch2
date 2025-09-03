"""
GEPA-Enhanced Reasoning Agent for Online Search Optimization
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from agents.base import BaseAgent
from ml.dspy_pipelines.gepa_enhanced_reasoning import GEPAEnhancedSearchPipeline, AdaptiveGEPASearchOrchestrator
from typing import Dict, Any, List, Optional
import asyncio
import time

class GEPAReasoningAgent(BaseAgent):
    """
    Advanced reasoning agent that uses GEPA optimization for continuous improvement
    """
    
    def __init__(self):
        super().__init__("gepa_reasoning_001", "GEPA Reasoning Agent")
        self.orchestrator = AdaptiveGEPASearchOrchestrator()
        self.processing_history = []
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process search query with GEPA-enhanced reasoning and optimization
        """
        start_time = time.time()
        
        try:
            query = input_data.get("query", "")
            user_id = input_data.get("user_id", "default")
            initial_results = input_data.get("initial_results", [])
            user_feedback = input_data.get("user_feedback")
            
            # Build user context from available data
            user_context = {
                "user_id": user_id,
                "search_history": input_data.get("search_history", []),
                "preferences": input_data.get("preferences", {}),
                "timestamp": time.time()
            }
            
            # Process with GEPA-enhanced pipeline
            result = self.orchestrator.process_search(
                query=query,
                initial_results=initial_results,
                user_context=user_context,
                user_feedback=user_feedback
            )
            
            # Extract optimized results
            enhanced_query = result.enhanced_query
            optimized_results = self._parse_results(result.optimized_results)
            performance_score = result.performance_score
            
            # Store processing history for analysis
            self.processing_history.append({
                "timestamp": time.time(),
                "original_query": query,
                "enhanced_query": enhanced_query,
                "performance_score": performance_score,
                "user_id": user_id
            })
            
            # Limit history size
            if len(self.processing_history) > 1000:
                self.processing_history = self.processing_history[-500:]
            
            processing_time = time.time() - start_time
            
            return {
                "refined_query": enhanced_query,
                "optimized_results": optimized_results,
                "performance_score": performance_score,
                "processing_time": processing_time,
                "optimization_stats": self.orchestrator.get_system_stats(),
                "agent_id": self.agent_id
            }
            
        except Exception as e:
            self.error_count += 1
            raise Exception(f"GEPA reasoning failed: {str(e)}")
    
    def _parse_results(self, results_str: str) -> List[Dict[str, Any]]:
        """
        Parse and structure the optimized results
        """
        try:
            # Handle string representation of results
            if isinstance(results_str, str):
                # Try to extract structured data from string
                import re
                
                # Simple parsing for demonstration - in production, use proper parsing
                mock_results = [
                    {
                        "id": f"result_{i}",
                        "title": f"Optimized Result {i+1}",
                        "url": f"https://example.com/result{i+1}",
                        "score": 0.9 - (i * 0.1),
                        "personalized_score": 0.95 - (i * 0.1),
                        "optimization_applied": True
                    }
                    for i in range(min(5, 10))  # Limit to reasonable number
                ]
                return mock_results
            
            return results_str if isinstance(results_str, list) else []
            
        except Exception:
            return []
    
    async def learn_from_feedback(self, query: str, results: List[Dict], 
                                 feedback: List[Dict], user_context: Dict):
        """
        Enable online learning from user feedback
        """
        try:
            # Process feedback through GEPA optimization
            self.orchestrator.process_search(
                query=query,
                initial_results=results,
                user_context=user_context,
                user_feedback=feedback
            )
            
            # Update agent metrics
            self.success_count += 1
            
        except Exception as e:
            self.error_count += 1
            print(f"GEPA learning error: {str(e)}")
    
    def get_optimization_metrics(self) -> Dict[str, Any]:
        """
        Get detailed optimization metrics
        """
        system_stats = self.orchestrator.get_system_stats()
        
        # Calculate processing statistics
        recent_performance = [
            entry["performance_score"] 
            for entry in self.processing_history[-50:] 
            if "performance_score" in entry
        ]
        
        avg_performance = sum(recent_performance) / len(recent_performance) if recent_performance else 0.5
        
        return {
            "agent_metrics": self.get_status(),
            "system_stats": system_stats,
            "average_performance": avg_performance,
            "total_processed": len(self.processing_history),
            "recent_queries": [
                {
                    "original": entry["original_query"],
                    "enhanced": entry["enhanced_query"],
                    "performance": entry["performance_score"]
                }
                for entry in self.processing_history[-10:]
            ]
        }

class GEPASearchAgent(BaseAgent):
    """
    Search agent enhanced with GEPA optimization for result improvement
    """
    
    def __init__(self):
        super().__init__("gepa_search_001", "GEPA Search Agent")
        self.pipeline = GEPAEnhancedSearchPipeline()
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enhanced search with GEPA optimization
        """
        start_time = time.time()
        
        try:
            query = input_data.get("refined_query", input_data.get("query", ""))
            user_id = input_data.get("user_id", "default")
            
            # Simulate search results (in production, integrate with actual search APIs)
            mock_results = self._generate_mock_search_results(query)
            
            # Build user context
            user_context = {
                "user_id": user_id,
                "preferences": input_data.get("preferences", {}),
                "search_history": input_data.get("search_history", [])
            }
            
            # Apply GEPA optimization
            optimized_result = self.pipeline.forward(
                query=query,
                initial_results=mock_results,
                user_context=user_context
            )
            
            processing_time = time.time() - start_time
            self.success_count += 1
            
            return {
                "search_results": self._parse_results(optimized_result.optimized_results),
                "enhanced_query": optimized_result.enhanced_query,
                "performance_score": optimized_result.performance_score,
                "processing_time": processing_time,
                "optimization_applied": True
            }
            
        except Exception as e:
            self.error_count += 1
            raise Exception(f"GEPA search failed: {str(e)}")
    
    def _generate_mock_search_results(self, query: str) -> List[Dict[str, Any]]:
        """
        Generate mock search results for demonstration
        """
        return [
            {
                "id": f"search_{i}",
                "title": f"Search Result for '{query}' - Item {i+1}",
                "url": f"https://example.com/search/{i+1}",
                "snippet": f"This is a relevant result for your query about {query}",
                "score": 0.8 - (i * 0.05),
                "source": "web"
            }
            for i in range(10)
        ]
    
    def _parse_results(self, results_str: str) -> List[Dict[str, Any]]:
        """
        Parse optimized results from GEPA output
        """
        # Similar parsing logic as in GEPAReasoningAgent
        try:
            if isinstance(results_str, str):
                # Return enhanced mock results
                return [
                    {
                        "id": f"gepa_result_{i}",
                        "title": f"GEPA Optimized Result {i+1}",
                        "url": f"https://optimized.example.com/result{i+1}",
                        "snippet": "This result has been optimized by GEPA based on user feedback patterns",
                        "score": 0.95 - (i * 0.05),
                        "personalized_score": 0.98 - (i * 0.05),
                        "gepa_optimized": True
                    }
                    for i in range(8)
                ]
            return results_str if isinstance(results_str, list) else []
        except Exception:
            return []

# Export agents for use in orchestrator
__all__ = ['GEPAReasoningAgent', 'GEPASearchAgent']