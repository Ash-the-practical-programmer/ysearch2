from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
from ml.ssrl.framework import SSRLFramework, FeedbackEvent
import time

class FeedbackData(BaseModel):
    """Model for user feedback data"""
    query: str
    result_id: str
    user_id: str
    feedback_type: str  # "click", "like", "dislike", "skip"
    timestamp: float

class FeedbackService:
    """Service for handling real-time user feedback"""
    
    def __init__(self):
        self.ssrl_framework = SSRLFramework()
        self.feedback_queue: List[FeedbackData] = []
        
    def record_feedback(self, feedback: FeedbackData):
        """Record user feedback"""
        self.feedback_queue.append(feedback)
        
        # Convert to SSRL feedback event
        feedback_value = self._convert_feedback_type_to_value(feedback.feedback_type)
        ssrl_feedback = FeedbackEvent(
            query=feedback.query,
            result_id=feedback.result_id,
            user_id=feedback.user_id,
            feedback=feedback_value,
            timestamp=feedback.timestamp
        )
        
        # Record in SSRL framework
        self.ssrl_framework.record_feedback(ssrl_feedback)
        
    def _convert_feedback_type_to_value(self, feedback_type: str) -> float:
        """Convert feedback type to numerical value"""
        feedback_map = {
            "click": 0.5,
            "like": 1.0,
            "dislike": -1.0,
            "skip": -0.5
        }
        return feedback_map.get(feedback_type, 0.0)
        
    async def process_feedback_batch(self):
        """Process a batch of feedback for learning"""
        if not self.feedback_queue:
            return {}
            
        # Process feedback in SSRL framework
        updates = self.ssrl_framework.process_feedback_batch()
        
        # Clear processed feedback
        processed_count = len(self.feedback_queue)
        self.feedback_queue.clear()
        
        return {
            "processed_count": processed_count,
            "agent_updates": updates
        }
        
    def get_recent_feedback(self, limit: int = 10) -> List[FeedbackData]:
        """Get recent feedback entries"""
        return self.feedback_queue[-limit:]

# Global instance of the feedback service
feedback_service = FeedbackService()