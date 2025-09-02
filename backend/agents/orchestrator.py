from typing import Dict, Any, List
from agents.base import BaseAgent, SearchAgent, ReasoningAgent, RankingAgent, PersonalizationAgent
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
            PersonalizationAgent
        ]
        
        for agent_class in agent_classes:
            agent = agent_class()
            self.agents[agent.agent_id] = agent
            
    async def process_search_query(self, query: str, user_id: str = "default") -> Dict[str, Any]:
        """Process a search query through the multi-agent system"""
        start_time = time.time()
        success = True
        
        try:
            # Step 1: Reasoning Agent processes the query
            reasoning_start = time.time()
            reasoning_input = {"query": query, "user_id": user_id}
            reasoning_output = await self._process_agent("reasoning_001", reasoning_input)
            reasoning_time = time.time() - reasoning_start
            
            # Step 2: Search Agent performs the search
            search_start = time.time()
            search_input = {**reasoning_output, "user_id": user_id}
            search_output = await self._process_agent("search_001", search_input)
            search_time = time.time() - search_start
            
            # Step 3: Ranking Agent ranks the results
            ranking_start = time.time()
            ranking_input = {**search_output, "user_id": user_id}
            ranking_output = await self._process_agent("ranking_001", ranking_input)
            ranking_time = time.time() - ranking_start
            
            # Step 4: Personalization Agent personalizes the results
            personalization_start = time.time()
            personalization_input = {**ranking_output, "user_id": user_id}
            personalization_output = await self._process_agent("personalization_001", personalization_input)
            personalization_time = time.time() - personalization_start
            
            # Record agent metrics
            metrics_service.record_agent_processing("reasoning_001", reasoning_time)
            metrics_service.record_agent_processing("search_001", search_time)
            metrics_service.record_agent_processing("ranking_001", ranking_time)
            metrics_service.record_agent_processing("personalization_001", personalization_time)
            
            # Record personalization usage
            metrics_service.record_personalization(True)
            
        except Exception as e:
            success = False
            raise e
        finally:
            # Record overall search metrics
            total_time = time.time() - start_time
            metrics_service.record_search_query(total_time, success)
            metrics_service.flush_metrics()
        
        return {
            "original_query": query,
            "refined_query": reasoning_output.get("refined_query"),
            "results": personalization_output.get("personalized_results", []),
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