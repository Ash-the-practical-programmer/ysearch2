from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import os

class UserProfile(BaseModel):
    """User profile model for personalization"""
    user_id: str
    preferences: Dict[str, float] = {}
    search_history: List[str] = []
    clicked_results: List[str] = []
    feedback_scores: Dict[str, float] = {}

class PersonalizationService:
    """Service for managing user personalization"""
    
    def __init__(self, data_file: str = "user_profiles.json"):
        self.data_file = data_file
        self.profiles: Dict[str, UserProfile] = self._load_profiles()
        
    def _load_profiles(self) -> Dict[str, UserProfile]:
        """Load user profiles from file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    return {user_id: UserProfile(**profile) for user_id, profile in data.items()}
            except Exception:
                return {}
        return {}
        
    def _save_profiles(self):
        """Save user profiles to file"""
        try:
            # Convert UserProfile objects to dictionaries
            data = {user_id: profile.dict() for user_id, profile in self.profiles.items()}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving profiles: {e}")
            
    def get_user_profile(self, user_id: str) -> UserProfile:
        """Get or create user profile"""
        if user_id not in self.profiles:
            self.profiles[user_id] = UserProfile(user_id=user_id)
        return self.profiles[user_id]
        
    def update_preferences(self, user_id: str, preferences: Dict[str, float]):
        """Update user preferences"""
        profile = self.get_user_profile(user_id)
        profile.preferences.update(preferences)
        self._save_profiles()
        
    def add_search_history(self, user_id: str, query: str):
        """Add search query to user history"""
        profile = self.get_user_profile(user_id)
        profile.search_history.append(query)
        # Keep only the last 100 searches
        profile.search_history = profile.search_history[-100:]
        self._save_profiles()
        
    def record_result_click(self, user_id: str, result_id: str):
        """Record when user clicks on a search result"""
        profile = self.get_user_profile(user_id)
        profile.clicked_results.append(result_id)
        # Keep only the last 1000 clicks
        profile.clicked_results = profile.clicked_results[-1000:]
        self._save_profiles()
        
    def record_feedback(self, user_id: str, result_id: str, score: float):
        """Record user feedback for a result"""
        profile = self.get_user_profile(user_id)
        profile.feedback_scores[result_id] = score
        self._save_profiles()
        
    def get_personalized_score(self, user_id: str, base_score: float, result_id: str, categories: List[str]) -> float:
        """Calculate personalized score based on user profile"""
        profile = self.get_user_profile(user_id)
        
        # Start with base score
        personalized_score = base_score
        
        # Adjust based on user preferences
        preference_boost = 0.0
        for category in categories:
            if category in profile.preferences:
                preference_boost += profile.preferences[category] * 0.1
                
        # Adjust based on past feedback
        if result_id in profile.feedback_scores:
            feedback_multiplier = profile.feedback_scores[result_id]
            personalized_score *= (1 + feedback_multiplier * 0.2)
            
        # Apply preference boost
        personalized_score *= (1 + preference_boost)
        
        # Clamp between 0 and 1
        personalized_score = max(0.0, min(1.0, personalized_score))
        
        return personalized_score

# Global instance of the personalization service
personalization_service = PersonalizationService()