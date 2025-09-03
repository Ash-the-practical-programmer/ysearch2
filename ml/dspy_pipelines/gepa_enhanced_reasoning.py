"""
Enhanced DSPy Pipeline with GEPA Optimizers for Online Search Result Optimization
"""
import dspy
from dspy import GEPA
from typing import List, Optional, Dict, Any
import time

class SearchOptimizationSignature(dspy.Signature):
    """Signature for optimizing search results based on user feedback"""
    query = dspy.InputField(desc="The search query")
    initial_results = dspy.InputField(desc="Initial search results from the search agent")
    user_context = dspy.InputField(desc="User preferences and historical behavior")
    user_feedback = dspy.InputField(desc="Previous user feedback on similar queries")
    optimized_results = dspy.OutputField(desc="Re-ranked and optimized search results")

class QueryEnhancementSignature(dspy.Signature):
    """Signature for enhancing queries with learned patterns"""
    original_query = dspy.InputField(desc="The original user query")
    user_history = dspy.InputField(desc="User's search history and preferences")
    feedback_patterns = dspy.InputField(desc="Patterns learned from user feedback")
    enhanced_query = dspy.OutputField(desc="Enhanced query optimized for better results")

class ResultRankingSignature(dspy.Signature):
    """Signature for intelligent result ranking"""
    query = dspy.InputField(desc="The search query")
    results = dspy.InputField(desc="List of search results to rank")
    personalization_data = dspy.InputField(desc="User personalization data")
    ranked_results = dspy.OutputField(desc="Results ranked by relevance and personalization")

class GEPAEnhancedSearchPipeline(dspy.Module):
    """
    Enhanced search pipeline with GEPA optimization for continuous learning
    """
    
    def __init__(self, learning_rate: float = 0.01, optimization_steps: int = 10):
        super().__init__()
        
        # Core pipeline components
        self.query_enhancer = dspy.Predict(QueryEnhancementSignature)
        self.result_optimizer = dspy.Predict(SearchOptimizationSignature)
        self.result_ranker = dspy.Predict(ResultRankingSignature)
        
        # GEPA optimizer for online learning
        self.gepa_optimizer = GEPA(
            metric=self._search_quality_metric,
            auto=True
        )
        
        # Learning parameters
        self.learning_rate = learning_rate
        self.optimization_steps = optimization_steps
        
        # Storage for feedback and optimization
        self.feedback_history = []
        self.performance_metrics = {}
        
    def _search_quality_metric(self, gold, pred, trace, pred_name, pred_trace):
        """
        Custom metric to evaluate search result quality based on user feedback
        Compatible with GEPA requirements: (gold, pred, trace, pred_name, pred_trace)
        """
        try:
            # Extract feedback from gold (expected) data
            actual_feedback = gold.get('feedback', []) if hasattr(gold, 'get') else []
            
            if not actual_feedback:
                return 0.5  # Neutral score for no feedback
                
            # Calculate quality score based on user interactions
            clicks = sum(1 for f in actual_feedback if f.get('type') == 'click')
            likes = sum(1 for f in actual_feedback if f.get('type') == 'like')
            dislikes = sum(1 for f in actual_feedback if f.get('type') == 'dislike')
            
            if len(actual_feedback) == 0:
                return 0.5
            
            # Weighted quality score
            quality_score = (clicks * 0.3 + likes * 0.5 - dislikes * 0.4) / len(actual_feedback)
            return max(0.0, min(1.0, quality_score))
            
        except Exception:
            return 0.5  # Return neutral score on any error
    
    def forward(self, query: str, initial_results: List[Dict], user_context: Dict, 
                user_feedback: Optional[List[Dict]] = None):
        """
        Process a search query with GEPA-optimized result enhancement
        """
        # Enhance the query based on user patterns
        enhanced_query_result = self.query_enhancer(
            original_query=query,
            user_history=str(user_context.get('search_history', [])),
            feedback_patterns=str(self._extract_feedback_patterns())
        )
        
        # Rank initial results with personalization
        ranking_result = self.result_ranker(
            query=enhanced_query_result.enhanced_query,
            results=str(initial_results),
            personalization_data=str(user_context)
        )
        
        # Optimize results using GEPA if feedback is available
        if user_feedback:
            optimized_result = self.result_optimizer(
                query=enhanced_query_result.enhanced_query,
                initial_results=ranking_result.ranked_results,
                user_context=str(user_context),
                user_feedback=str(user_feedback)
            )
            final_results = optimized_result.optimized_results
        else:
            final_results = ranking_result.ranked_results
        
        return dspy.Prediction(
            enhanced_query=enhanced_query_result.enhanced_query,
            optimized_results=final_results,
            performance_score=self._calculate_performance_score()
        )
    
    def learn_from_feedback(self, query: str, results: List[Dict], 
                           feedback: List[Dict], user_context: Dict):
        """
        Online learning from user feedback using GEPA optimization
        """
        # Store feedback for pattern analysis
        self.feedback_history.append({
            'query': query,
            'results': results,
            'feedback': feedback,
            'timestamp': time.time(),
            'user_context': user_context
        })
        
        # Optimize pipeline using GEPA
        self._optimize_with_gepa(query, results, feedback, user_context)
    
    def _optimize_with_gepa(self, query: str, results: List[Dict], 
                           feedback: List[Dict], user_context: Dict):
        """
        Use GEPA to optimize the pipeline based on feedback
        """
        # Create training example
        example = dspy.Example(
            query=query,
            initial_results=results,
            user_context=user_context,
            user_feedback=feedback,
            expected_quality=self._search_quality_metric(results, feedback)
        )
        
        # Optimize the pipeline
        optimized_pipeline = self.gepa_optimizer.compile(
            student=self,
            trainset=[example],
            valset=[example],
            num_trials=self.optimization_steps
        )
        
        # Update current pipeline parameters
        self._update_from_optimized(optimized_pipeline)
    
    def _update_from_optimized(self, optimized_pipeline):
        """
        Update current pipeline with optimized parameters
        """
        # Update the predictors with optimized versions
        if hasattr(optimized_pipeline, 'query_enhancer'):
            self.query_enhancer = optimized_pipeline.query_enhancer
        if hasattr(optimized_pipeline, 'result_optimizer'):
            self.result_optimizer = optimized_pipeline.result_optimizer
        if hasattr(optimized_pipeline, 'result_ranker'):
            self.result_ranker = optimized_pipeline.result_ranker
    
    def _extract_feedback_patterns(self) -> Dict[str, Any]:
        """
        Extract patterns from historical feedback for learning
        """
        if not self.feedback_history:
            return {}
        
        patterns = {
            'popular_queries': {},
            'successful_results': [],
            'user_preferences': {},
            'temporal_patterns': {}
        }
        
        for feedback_entry in self.feedback_history[-100:]:  # Last 100 entries
            query = feedback_entry['query']
            feedback = feedback_entry['feedback']
            
            # Track popular queries
            patterns['popular_queries'][query] = patterns['popular_queries'].get(query, 0) + 1
            
            # Track successful results
            for f in feedback:
                if f.get('type') in ['click', 'like']:
                    patterns['successful_results'].append({
                        'query': query,
                        'result_id': f.get('result_id'),
                        'feedback_type': f.get('type')
                    })
        
        return patterns
    
    def _calculate_performance_score(self) -> float:
        """
        Calculate overall pipeline performance score
        """
        if not self.feedback_history:
            return 0.5  # Neutral score
        
        recent_feedback = self.feedback_history[-10:]  # Last 10 interactions
        total_score = 0.0
        
        for entry in recent_feedback:
            feedback = entry['feedback']
            score = self._search_quality_metric(entry['results'], feedback)
            total_score += score
        
        return total_score / len(recent_feedback) if recent_feedback else 0.5
    
    def get_optimization_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the optimization process
        """
        return {
            'total_feedback_entries': len(self.feedback_history),
            'current_performance': self._calculate_performance_score(),
            'optimization_iterations': len(self.performance_metrics),
            'learning_rate': self.learning_rate,
            'recent_patterns': self._extract_feedback_patterns()
        }

class AdaptiveGEPASearchOrchestrator:
    """
    Orchestrator that manages multiple GEPA-enhanced pipelines for different query types
    """
    
    def __init__(self):
        self.pipelines = {
            'general': GEPAEnhancedSearchPipeline(),
            'academic': GEPAEnhancedSearchPipeline(learning_rate=0.005),
            'commercial': GEPAEnhancedSearchPipeline(learning_rate=0.02),
            'news': GEPAEnhancedSearchPipeline(optimization_steps=5)
        }
        
        self.query_classifier = dspy.Predict("query -> query_type")
    
    def process_search(self, query: str, initial_results: List[Dict], 
                      user_context: Dict, user_feedback: Optional[List[Dict]] = None):
        """
        Route query to appropriate GEPA-enhanced pipeline
        """
        # Classify query type
        query_type = self._classify_query(query)
        
        # Get appropriate pipeline
        pipeline = self.pipelines.get(query_type, self.pipelines['general'])
        
        # Process with GEPA optimization
        result = pipeline.forward(query, initial_results, user_context, user_feedback)
        
        # Learn from feedback if provided
        if user_feedback:
            pipeline.learn_from_feedback(query, initial_results, user_feedback, user_context)
        
        return result
    
    def _classify_query(self, query: str) -> str:
        """
        Classify query type for pipeline selection
        """
        # Simple keyword-based classification (can be enhanced with ML)
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['research', 'paper', 'study', 'academic']):
            return 'academic'
        elif any(word in query_lower for word in ['buy', 'price', 'shop', 'purchase']):
            return 'commercial'
        elif any(word in query_lower for word in ['news', 'latest', 'breaking', 'today']):
            return 'news'
        else:
            return 'general'
    
    def get_system_stats(self) -> Dict[str, Any]:
        """
        Get comprehensive system statistics
        """
        stats = {}
        for pipeline_name, pipeline in self.pipelines.items():
            stats[pipeline_name] = pipeline.get_optimization_stats()
        
        return {
            'pipeline_stats': stats,
            'total_pipelines': len(self.pipelines),
            'system_status': 'active'
        }

# Export the main classes for use in the backend
__all__ = ['GEPAEnhancedSearchPipeline', 'AdaptiveGEPASearchOrchestrator']