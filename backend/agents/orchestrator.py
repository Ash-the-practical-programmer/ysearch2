from typing import Dict, Any, List
from agents.base import BaseAgent, SearchAgent, ReasoningAgent, RankingAgent, PersonalizationAgent
from agents.gepa_agent import GEPAReasoningAgent, GEPASearchAgent
import asyncio
import time
from services.metrics import metrics_service

class AgentOrchestrator:
    """Orchestrates the multi-agent system for search processing"""
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self._initialize_agents()
        
    def _initialize_agents(self):
        """Initialize all agents in the system"""
        agent_classes = [
            SearchAgent,
            ReasoningAgent,
            RankingAgent,
            PersonalizationAgent,
            GEPAReasoningAgent,
            GEPASearchAgent
        ]
        
        for agent_class in agent_classes:
            agent = agent_class()
            self.agents[agent.agent_id] = agent
            
    async def process_search_query(self, query: str, user_id: str = "default", use_gepa: bool = True) -> Dict[str, Any]:
        """Process a search query through the multi-agent system with optional GEPA optimization"""
        start_time = time.time()
        success = True
        
        try:
            if use_gepa:
                # Enhanced GEPA-powered pipeline
                return await self._process_with_gepa(query, user_id)
            else:
                # Original pipeline
                return await self._process_traditional(query, user_id)
                
        except Exception as e:
            success = False
            raise e
        finally:
            # Record overall search metrics
            total_time = time.time() - start_time
            metrics_service.record_search_query(total_time, success)
            metrics_service.flush_metrics()
    
    async def _process_with_gepa(self, query: str, user_id: str) -> Dict[str, Any]:
        """Process search query using GEPA-enhanced agents"""
        # Step 1: GEPA Reasoning Agent processes and enhances the query
        reasoning_start = time.time()
        reasoning_input = {"query": query, "user_id": user_id}
        reasoning_output = await self._process_agent("gepa_reasoning_001", reasoning_input)
        reasoning_time = time.time() - reasoning_start
        
        # Step 2: GEPA Search Agent performs optimized search
        search_start = time.time()
        search_input = {**reasoning_output, "user_id": user_id}
        search_output = await self._process_agent("gepa_search_001", search_input)
        search_time = time.time() - search_start
        
        # Step 3: Traditional Ranking Agent (can be enhanced with GEPA later)
        ranking_start = time.time()
        ranking_input = {**search_output, "user_id": user_id}
        ranking_output = await self._process_agent("ranking_001", ranking_input)
        ranking_time = time.time() - ranking_start
        
        # Step 4: Personalization Agent
        personalization_start = time.time()
        personalization_input = {**ranking_output, "user_id": user_id}
        personalization_output = await self._process_agent("personalization_001", personalization_input)
        personalization_time = time.time() - personalization_start
        
        # Record metrics for GEPA agents
        metrics_service.record_agent_processing("gepa_reasoning_001", reasoning_time)
        metrics_service.record_agent_processing("gepa_search_001", search_time)
        metrics_service.record_agent_processing("ranking_001", ranking_time)
        metrics_service.record_agent_processing("personalization_001", personalization_time)
        
        return {
            "original_query": query,
            "refined_query": reasoning_output.get("refined_query"),
            "enhanced_query": reasoning_output.get("enhanced_query"),
            "results": search_output.get("search_results", []),
            "gepa_optimized": True,
            "performance_score": reasoning_output.get("performance_score", 0.5),
            "optimization_stats": reasoning_output.get("optimization_stats", {}),
            "processing_steps": [
                "gepa_reasoning", "gepa_search", "ranking", "personalization"
            ]
        }
    
    async def _process_traditional(self, query: str, user_id: str) -> Dict[str, Any]:
        """Process search query using traditional agents"""
        # Original implementation
        reasoning_start = time.time()
        reasoning_input = {"query": query, "user_id": user_id}
        reasoning_output = await self._process_agent("reasoning_001", reasoning_input)
        reasoning_time = time.time() - reasoning_start
        
        search_start = time.time()
        search_input = {**reasoning_output, "user_id": user_id}
        search_output = await self._process_agent("search_001", search_input)
        search_time = time.time() - search_start
        
        ranking_start = time.time()
        ranking_input = {**search_output, "user_id": user_id}
        ranking_output = await self._process_agent("ranking_001", ranking_input)
        ranking_time = time.time() - ranking_start
        
        personalization_start = time.time()
        personalization_input = {**ranking_output, "user_id": user_id}
        personalization_output = await self._process_agent("personalization_001", personalization_input)
        personalization_time = time.time() - personalization_start
        
        # Record agent metrics
        metrics_service.record_agent_processing("reasoning_001", reasoning_time)
        metrics_service.record_agent_processing("search_001", search_time)
        metrics_service.record_agent_processing("ranking_001", ranking_time)
        metrics_service.record_agent_processing("personalization_001", personalization_time)
        
        return {
            "original_query": query,
            "refined_query": reasoning_output.get("refined_query"),
            "results": personalization_output.get("personalized_results", []),
            "gepa_optimized": False,
            "processing_steps": [
                "reasoning", "search", "ranking", "personalization"
            ]
        }
        
    async def _process_agent(self, agent_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input through a specific agent"""
        if agent_id not in self.agents:
            raise ValueError(f"Agent {agent_id} not found")
            
        return await self.agents[agent_id].process(input_data)
        
    def get_agent_status(self) -> List[Dict[str, Any]]:
        """Get status of all agents"""
        return [agent.get_status() for agent in self.agents.values()]