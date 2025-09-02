from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from agents.orchestrator import AgentOrchestrator
from services.feedback import feedback_service, FeedbackData
from services.personalization import personalization_service
from services.metrics import metrics_service
import time

app = FastAPI(
    title="YSearch2 API",
    description="API for the YSearch2 Personalized Agentic Web Search Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent orchestrator
orchestrator = AgentOrchestrator()

class SearchRequest(BaseModel):
    query: str
    user_id: Optional[str] = "default"

class SearchResult(BaseModel):
    id: Optional[str] = None
    title: str
    url: str
    score: float
    personalized_score: Optional[float] = None

class SearchResponse(BaseModel):
    original_query: str
    refined_query: Optional[str]
    results: List[SearchResult]
    processing_steps: List[str]

class FeedbackRequest(BaseModel):
    query: str
    result_id: str
    user_id: str
    feedback_type: str  # "click", "like", "dislike", "skip"

class FeedbackResponse(BaseModel):
    status: str
    message: str

class ProcessFeedbackResponse(BaseModel):
    processed_count: int
    agent_updates: Dict[str, Any]

class MetricsResponse(BaseModel):
    search_metrics: Dict[str, Any]
    agent_metrics: Dict[str, Any]
    buffer_size: int
    last_updated: str

@app.get("/")
async def root():
    return {"message": "Welcome to YSearch2 API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/agents/status")
async def get_agent_status():
    """Get the status of all agents in the system"""
    return orchestrator.get_agent_status()

@app.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """Process a search query through the multi-agent system"""
    try:
        # Record search in user history
        personalization_service.add_search_history(request.user_id, request.query)
        
        result = await orchestrator.process_search_query(
            query=request.query,
            user_id=request.user_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search processing failed: {str(e)}")

@app.post("/feedback", response_model=FeedbackResponse)
async def record_feedback(request: FeedbackRequest):
    """Record user feedback on search results"""
    try:
        feedback = FeedbackData(
            query=request.query,
            result_id=request.result_id,
            user_id=request.user_id,
            feedback_type=request.feedback_type,
            timestamp=time.time()
        )
        
        feedback_service.record_feedback(feedback)
        
        # Also record in personalization service
        feedback_value = 0.0
        if request.feedback_type == "like":
            feedback_value = 1.0
        elif request.feedback_type == "dislike":
            feedback_value = -1.0
        elif request.feedback_type == "click":
            feedback_value = 0.5
            
        personalization_service.record_feedback(
            request.user_id, request.result_id, feedback_value
        )
        
        return FeedbackResponse(
            status="success",
            message=f"Feedback recorded for result {request.result_id}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")

@app.post("/process_feedback", response_model=ProcessFeedbackResponse)
async def process_feedback():
    """Process accumulated feedback for learning"""
    try:
        result = await feedback_service.process_feedback_batch()
        return ProcessFeedbackResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process feedback: {str(e)}")

@app.get("/feedback/recent")
async def get_recent_feedback(limit: int = 10):
    """Get recent feedback entries"""
    return feedback_service.get_recent_feedback(limit)

@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Get system performance metrics"""
    metrics_summary = metrics_service.get_metrics_summary()
    return MetricsResponse(**metrics_summary)

@app.post("/metrics/flush")
async def flush_metrics():
    """Flush metrics to persistent storage"""
    metrics_service.flush_metrics()
    return {"status": "success", "message": "Metrics flushed to storage"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)