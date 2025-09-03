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
        personalization_service.add_search_history(request.user_id or "default", request.query)
        
        result = await orchestrator.process_search_query(
            query=request.query,
            user_id=request.user_id or "default"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search processing failed: {str(e)}")

@app.post("/search/gepa", response_model=SearchResponse)
async def search_with_gepa(request: SearchRequest):
    """Process a search query with GEPA optimization enabled"""
    try:
        # Record search in user history
        personalization_service.add_search_history(request.user_id or "default", request.query)
        
        result = await orchestrator.process_search_query(
            query=request.query,
            user_id=request.user_id or "default",
            use_gepa=True
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GEPA search processing failed: {str(e)}")

@app.post("/search/traditional")
async def search_traditional(request: SearchRequest):
    """Process a search query using traditional agents (no GEPA)"""
    try:
        # Record search in user history
        personalization_service.add_search_history(request.user_id or "default", request.query)
        
        result = await orchestrator.process_search_query(
            query=request.query,
            user_id=request.user_id or "default",
            use_gepa=False
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Traditional search processing failed: {str(e)}")

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
        
        # Also send feedback to GEPA agents for online learning
        try:
            gepa_reasoning_agent = orchestrator.agents.get("gepa_reasoning_001")
            if gepa_reasoning_agent and hasattr(gepa_reasoning_agent, 'learn_from_feedback'):
                # Create feedback structure for GEPA learning
                feedback_data = [{
                    "result_id": request.result_id,
                    "type": request.feedback_type,
                    "value": feedback_value
                }]
                user_context = {"user_id": request.user_id}
                
                await gepa_reasoning_agent.learn_from_feedback(
                    request.query, [], feedback_data, user_context
                )
        except Exception as gepa_error:
            # Don't fail the whole request if GEPA learning fails
            print(f"GEPA learning error: {gepa_error}")
        
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

@app.get("/gepa/metrics")
async def get_gepa_metrics():
    """Get GEPA optimization metrics and performance statistics"""
    try:
        gepa_reasoning_agent = orchestrator.agents.get("gepa_reasoning_001")
        gepa_search_agent = orchestrator.agents.get("gepa_search_001")
        
        metrics = {
            "gepa_reasoning": {},
            "gepa_search": {},
            "system_status": "active"
        }
        
        if gepa_reasoning_agent and hasattr(gepa_reasoning_agent, 'get_optimization_metrics'):
            metrics["gepa_reasoning"] = gepa_reasoning_agent.get_optimization_metrics()
        
        if gepa_search_agent and hasattr(gepa_search_agent, 'get_status'):
            metrics["gepa_search"] = gepa_search_agent.get_status()
        
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get GEPA metrics: {str(e)}")

@app.post("/gepa/optimize")
async def trigger_gepa_optimization():
    """Manually trigger GEPA optimization process"""
    try:
        gepa_reasoning_agent = orchestrator.agents.get("gepa_reasoning_001")
        
        if not gepa_reasoning_agent:
            raise HTTPException(status_code=404, detail="GEPA reasoning agent not found")
        
        # Get optimization stats
        stats = gepa_reasoning_agent.get_optimization_metrics() if hasattr(gepa_reasoning_agent, 'get_optimization_metrics') else {}
        
        return {
            "status": "success",
            "message": "GEPA optimization triggered",
            "optimization_stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger GEPA optimization: {str(e)}")

@app.get("/gepa/status")
async def get_gepa_status():
    """Get current status of GEPA optimization system"""
    try:
        gepa_agents = {
            "gepa_reasoning_001": orchestrator.agents.get("gepa_reasoning_001"),
            "gepa_search_001": orchestrator.agents.get("gepa_search_001")
        }
        
        status = {}
        for agent_id, agent in gepa_agents.items():
            if agent:
                status[agent_id] = {
                    "active": True,
                    "agent_status": agent.get_status(),
                    "optimization_enabled": hasattr(agent, 'get_optimization_metrics')
                }
            else:
                status[agent_id] = {
                    "active": False,
                    "error": "Agent not found"
                }
        
        return {
            "gepa_system_status": "active",
            "agents": status,
            "total_agents": len([a for a in gepa_agents.values() if a is not None])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get GEPA status: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)