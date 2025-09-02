import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to YSearch2 API"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_search_endpoint():
    response = client.post("/search", json={"query": "test search"})
    assert response.status_code == 200
    data = response.json()
    assert "original_query" in data
    assert "results" in data