"""
Simplified YSearch2 Backend for Integration Testing
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time
import asyncio

app = FastAPI(
    title="YSearch2 API - Simplified",
    description="Simplified API for YSearch2 integration testing",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    user_id: Optional[str] = "default"

class SearchResult(BaseModel):
    id: str
    title: str
    url: str
    score: float
    personalized_score: Optional[float] = None
    gepa_optimized: Optional[bool] = False

class SearchResponse(BaseModel):
    original_query: str
    refined_query: Optional[str] = None
    enhanced_query: Optional[str] = None
    results: List[SearchResult]
    processing_steps: List[str]
    gepa_optimized: Optional[bool] = False
    performance_score: Optional[float] = None

class FeedbackRequest(BaseModel):
    query: str
    result_id: str
    user_id: str
    feedback_type: str

# Mock data storage
feedback_storage = []
search_history = {}

def generate_mock_results(query: str, is_gepa: bool = False) -> List[SearchResult]:
    """Generate mock search results"""
    base_results = [
        {
            "id": f"result_{i}",
            "title": f"{'GEPA-Optimized' if is_gepa else 'Standard'} Result for '{query}' - #{i+1}",
            "url": f"https://example.com/result{i+1}",
            "score": 0.95 - (i * 0.05),
            "personalized_score": (0.98 - (i * 0.03)) if is_gepa else None,
            "gepa_optimized": is_gepa
        }
        for i in range(8 if is_gepa else 6)
    ]
    
    return [SearchResult(**result) for result in base_results]

@app.get("/")
async def root():
    return {"message": "YSearch2 Simplified API - Ready for integration testing"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """Standard search endpoint (with GEPA by default)"""
    await asyncio.sleep(0.2)  # Simulate processing time
    
    results = generate_mock_results(request.query, is_gepa=True)
    
    return SearchResponse(
        original_query=request.query,
        refined_query=f"Enhanced: {request.query}",
        enhanced_query=f"GEPA-Enhanced: {request.query} (personalized)",
        results=results,
        processing_steps=["gepa_reasoning", "gepa_search", "ranking", "personalization"],
        gepa_optimized=True,
        performance_score=0.85
    )

@app.post("/search/gepa", response_model=SearchResponse)
async def search_with_gepa(request: SearchRequest):
    """Search with explicit GEPA optimization"""
    await asyncio.sleep(0.3)  # Simulate GEPA processing time
    
    results = generate_mock_results(request.query, is_gepa=True)
    
    return SearchResponse(
        original_query=request.query,
        refined_query=f"Refined: {request.query}",
        enhanced_query=f"GEPA-Enhanced: {request.query} (AI-optimized for better relevance)",
        results=results,
        processing_steps=["gepa_reasoning", "gepa_search", "gepa_ranking", "personalization"],
        gepa_optimized=True,
        performance_score=0.92
    )

@app.post("/search/traditional")
async def search_traditional(request: SearchRequest):
    """Traditional search without GEPA optimization"""
    await asyncio.sleep(0.15)  # Faster processing
    
    results = generate_mock_results(request.query, is_gepa=False)
    
    return SearchResponse(
        original_query=request.query,
        refined_query=f"Refined: {request.query}",
        results=results,
        processing_steps=["reasoning", "search", "ranking", "personalization"],
        gepa_optimized=False,
        performance_score=0.75
    )

@app.post("/feedback")
async def record_feedback(request: FeedbackRequest):
    """Record user feedback for learning"""
    feedback_entry = {
        "query": request.query,
        "result_id": request.result_id,
        "user_id": request.user_id,
        "feedback_type": request.feedback_type,
        "timestamp": time.time()
    }
    
    feedback_storage.append(feedback_entry)
    
    # Update search history
    if request.user_id not in search_history:
        search_history[request.user_id] = []
    
    search_history[request.user_id].append({
        "query": request.query,
        "feedback": request.feedback_type,
        "timestamp": time.time()
    })
    
    return {
        "status": "success",
        "message": f"Feedback recorded for result {request.result_id}",
        "feedback_count": len(feedback_storage)
    }

@app.get("/gepa/metrics")
async def get_gepa_metrics():
    """Get GEPA optimization metrics"""
    return {
        "gepa_reasoning": {
            "total_processed": len(feedback_storage),
            "average_performance": 0.87,
            "optimization_cycles": 15,
            "learning_rate": 0.01
        },
        "gepa_search": {
            "searches_optimized": len(feedback_storage) * 2,
            "improvement_score": 0.23,
            "user_satisfaction": 0.91
        },
        "system_status": "active",
        "feedback_entries": len(feedback_storage),
        "active_users": len(search_history)
    }

@app.get("/gepa/status")
async def get_gepa_status():
    """Get GEPA system status"""
    return {
        "gepa_system_status": "active",
        "agents": {
            "gepa_reasoning_001": {
                "active": True,
                "optimization_enabled": True,
                "performance_score": 0.87
            },
            "gepa_search_001": {
                "active": True,
                "optimization_enabled": True,
                "performance_score": 0.89
            }
        },
        "total_agents": 2,
        "uptime": time.time(),
        "version": "simplified_1.0"
    }

@app.post("/gepa/optimize")
async def trigger_gepa_optimization():
    """Manually trigger GEPA optimization"""
    await asyncio.sleep(0.5)  # Simulate optimization time
    
    return {
        "status": "success",
        "message": "GEPA optimization cycle completed",
        "optimization_stats": {
            "cycles_run": 3,
            "performance_improvement": 0.05,
            "timestamp": time.time()
        }
    }

@app.get("/agents/status")
async def get_agent_status():
    """Get status of all agents"""
    return [
        {
            "agent_id": "gepa_reasoning_001",
            "name": "GEPA Reasoning Agent",
            "status": "active",
            "success_count": 45,
            "error_count": 0
        },
        {
            "agent_id": "gepa_search_001", 
            "name": "GEPA Search Agent",
            "status": "active",
            "success_count": 48,
            "error_count": 1
        },
        {
            "agent_id": "ranking_001",
            "name": "Ranking Agent", 
            "status": "active",
            "success_count": 52,
            "error_count": 0
        }
    ]

@app.get("/feedback/recent")
async def get_recent_feedback(limit: int = 10):
    """Get recent feedback entries"""
    return feedback_storage[-limit:] if feedback_storage else []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)