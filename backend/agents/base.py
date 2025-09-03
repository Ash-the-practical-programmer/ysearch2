from abc import ABC, abstractmethod
from typing import Dict, Any, List
import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ml.youtu_integration.client import YoutuSearchClient
from services.personalization import personalization_service

class BaseAgent(ABC):
    """Base class for all agents in the system"""
    
    def __init__(self, agent_id: str, name: str):
        self.agent_id = agent_id
        self.name = name
        self.status = "idle"
        self.success_count = 0
        self.error_count = 0
        
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input data and return results"""
        pass
        
    def get_status(self) -> Dict[str, Any]:
        """Get current status of the agent"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status,
            "success_count": self.success_count,
            "error_count": self.error_count
        }

class SearchAgent(BaseAgent):
    """Agent responsible for performing searches using Youtu-agent"""
    
    def __init__(self):
        super().__init__("search_001", "Search Agent")
        self.youtu_client = YoutuSearchClient()  # In practice, pass API key
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self.status = "searching"
        
        query = input_data.get("refined_query", input_data.get("query", ""))
        
        # Perform text search using Youtu-agent
        search_results = await self.youtu_client.text_search(query)
        
        self.status = "idle"
        
        return {
            "agent_id": self.agent_id,
            "results": search_results
        }

class ReasoningAgent(BaseAgent):
    """Agent responsible for reasoning and query processing using DSPy"""
    
    def __init__(self):
        super().__init__("reasoning_001", "Reasoning Agent")
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self.status = "reasoning"
        # Placeholder for actual reasoning implementation
        await asyncio.sleep(0.1)  # Simulate async work
        self.status = "idle"
        
        return {
            "agent_id": self.agent_id,
            "refined_query": f"Refined: {input_data.get('query', '')}",
            "intent": "informational"
        }

class RankingAgent(BaseAgent):
    """Agent responsible for ranking search results"""
    
    def __init__(self):
        super().__init__("ranking_001", "Ranking Agent")
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self.status = "ranking"
        # Placeholder for actual ranking implementation
        await asyncio.sleep(0.1)  # Simulate async work
        self.status = "idle"
        
        results = input_data.get("results", [])
        # Simple re-ranking for demonstration
        ranked_results = sorted(results, key=lambda x: x.get("score", 0), reverse=True)
        
        return {
            "agent_id": self.agent_id,
            "ranked_results": ranked_results
        }

class PersonalizationAgent(BaseAgent):
    """Agent responsible for personalizing results based on user preferences"""
    
    def __init__(self):
        super().__init__("personalization_001", "Personalization Agent")
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self.status = "personalizing"
        
        results = input_data.get("results", [])
        user_id = input_data.get("user_id", "default")
        
        # Get user profile for personalization
        user_profile = personalization_service.get_user_profile(user_id)
        
        # Personalize results based on user profile
        personalized_results = []
        for result in results:
            # Extract categories/keywords from result (simplified)
            categories = ["general"]  # In practice, extract from result content
            
            # Calculate personalized score
            base_score = result.get("score", 0)
            result_id = result.get("id", "")
            
            personalized_score = personalization_service.get_personalized_score(
                user_id, base_score, result_id, categories
            )
            
            # Add personalized result
            personalized_result = {
                **result,
                "personalized_score": personalized_score
            }
            personalized_results.append(personalized_result)
        
        # Sort by personalized score
        personalized_results.sort(key=lambda x: x.get("personalized_score", 0), reverse=True)
        
        self.status = "idle"
        
        return {
            "agent_id": self.agent_id,
            "personalized_results": personalized_results
        }