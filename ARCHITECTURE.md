# YSearch2 - Personalized Agentic Web Search Platform

## System Architecture Overview

YSearch2 is a full-stack web search platform that leverages multiple AI agents working in coordination to provide personalized search results. The system combines multi-modal search capabilities, AI reasoning pipelines, and online learning to continuously improve search quality for each user.

### Core Components

1. **Frontend Layer**
   - React-based web interface for user interaction
   - Real-time result visualization
   - User preference management
   - Feedback collection mechanisms

2. **API Gateway & Orchestration Layer**
   - FastAPI-based backend for API management
   - Agent orchestration and coordination
   - Request routing and load balancing
   - Authentication and user session management

3. **Multi-Agent System**
   - Search Agents (using Tencent/Youtu-agent for multi-modal search)
   - Reasoning Agents (using DSPy for query understanding and processing)
   - Personalization Agents (user preference modeling)
   - Ranking Agents (result scoring and ordering)
   - Learning Agents (SSRL-based online learning and tuning)

4. **Data & Storage Layer**
   - User profile database (preferences, history, feedback)
   - Search result cache
   - Agent performance metrics
   - Learning model states

5. **Machine Learning Pipeline**
   - DSPy modules for natural language processing
   - SSRL framework for online learning
   - Model training and evaluation workflows
   - A/B testing infrastructure

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), Redis for caching
- **Database**: PostgreSQL for user data, Elasticsearch for search index
- **AI/ML**: DSPy, Tencent/Youtu-agent, SSRL implementation
- **Infrastructure**: Docker, Kubernetes (for deployment)
- **Package Management**: UV for Python dependency management

## Detailed Architecture

### 1. Frontend Layer
```
┌─────────────────────────────────────────────┐
│              React Frontend                 │
├─────────────────────────────────────────────┤
│  Search Interface    │  Results Display     │
│  User Preferences    │  Feedback Collection │
│  Profile Management  │  Visualization       │
└─────────────────────────────────────────────┘
```

### 2. API Gateway & Orchestration
```
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
├─────────────────────────────────────────────┤
│  REST API Endpoints  │  GraphQL API         │
│  Authentication      │  Rate Limiting       │
│  Request Validation  │  Logging & Metrics   │
└─────────────────────────────────────────────┘
```

### 3. Multi-Agent System
```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Orchestrator                       │
├─────────────────────────────────────────────────────────────┤
│  Search Agent     │  Reasoning Agent    │  Ranking Agent    │
│  (Youtu-agent)    │  (DSPy)             │  (Custom)         │
├─────────────────────────────────────────────────────────────┤
│  Personalization Agent     │  Learning Agent (SSRL)         │
└─────────────────────────────────────────────────────────────┘
```

### 4. Data Flow

1. **User Query Processing**:
   - User submits search query through frontend
   - Query routed to API gateway
   - Reasoning Agent (DSPy) processes and enhances query
   - Personalization Agent adds user context

2. **Search Execution**:
   - Search Agent (Youtu-agent) executes multi-modal search
   - Results collected from multiple sources
   - Ranking Agent scores and orders results

3. **Result Delivery**:
   - Results sent to frontend for display
   - User interacts with results (clicks, feedback)
   - Feedback collected for learning

4. **Online Learning**:
   - Learning Agent (SSRL) processes user feedback
   - Agent parameters tuned based on performance
   - Updated models deployed to production

### 5. Key Features

#### Multi-Modal Search
Leveraging Tencent/Youtu-agent for:
- Text-based search
- Image-based search
- Cross-modal retrieval (text-to-image, image-to-text)

#### AI Reasoning Pipelines
Using DSPy for:
- Query understanding and intent classification
- Query expansion and refinement
- Response generation and summarization

#### Online Learning & Personalization
Implementing SSRL for:
- Continuous agent tuning based on user feedback
- Personalized ranking models
- Adaptive search strategies per user

#### High Performance Package Management
Using UV for:
- Fast Python dependency resolution
- Reproducible environments
- Efficient CI/CD pipelines

## System Components Details

### Search Agent (Youtu-agent)
- Multi-modal search capabilities
- Integration with external search APIs
- Image and text processing
- Result caching and optimization

### Reasoning Agent (DSPy)
- Query analysis and enhancement
- Natural language understanding
- Logical reasoning pipelines
- Response generation

### Personalization Agent
- User preference modeling
- Historical behavior analysis
- Context-aware recommendations
- Privacy-preserving personalization

### Ranking Agent
- Result scoring algorithms
- Personalized ranking models
- Diversity and novelty optimization
- Real-time ranking adjustments

### Learning Agent (SSRL)
- Self-supervised learning from user feedback
- Agent parameter tuning
- Performance monitoring
- A/B testing framework

## Data Flow Diagram

```
┌──────────┐    Query     ┌──────────────┐
│  User    │ ───────────► │   Frontend   │
└──────────┘              └──────────────┘
                               │
                          API Request
                               ▼
┌──────────┐              ┌──────────────┐
│  SSRL    │ ◄────────────┤   Backend    │ ◄──────────┐
│ Learning │   Feedback   │ (FastAPI)    │            │
└──────────┘              └──────────────┘            │
                               │                      │
                      Agent Orchestration             │
                               ▼                      │
┌──────────┐    ┌──────────────────────────────┐      │
│External  │    │    Multi-Agent System        │      │
│Sources   │◄──►│                              │      │
└──────────┘    │ ┌─────────┐ ┌────────────┐  │      │
                │ │Search   │ │Reasoning   │  │      │
                │ │Agent    │ │Agent       │  │      │
                │ │(Youtu)  │ │(DSPy)      │  │      │
                │ └─────────┘ └────────────┘  │      │
                │ ┌─────────┐ ┌────────────┐  │      │
                │ │Ranking  │ │Personaliz. │  │      │
                │ │Agent    │ │Agent       │  │      │
                │ └─────────┘ └────────────┘  │      │
                │ ┌─────────┐                 │      │
                │ │Learning │                 │      │
                │ │Agent    │                 │      │
                │ │(SSRL)   │                 │      │
                │ └─────────┘                 │      │
                └──────────────────────────────┘      │
                               │                      │
                          API Response               │
                               ▼                      │
                      ┌──────────────┐               │
                      │   Frontend   │ ──────────────┘
                      └──────────────┘    Feedback
                               │
                          User View
                               ▼
                         ┌──────────┐
                         │  User    │
                         └──────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
└─────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Web Server     │ │   Web Server     │ │   Web Server     │
│   (Frontend)     │ │   (Frontend)     │ │   (Frontend)     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
            ▲                  ▲                  ▲
            └──────────────────┼──────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (FastAPI)                     │
└─────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Agent Cluster   │ │  Agent Cluster   │ │  Agent Cluster   │
│  (Search)        │ │  (Reasoning)     │ │  (Learning)      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
            ▲                  ▲                  ▲
            └──────────────────┼──────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PostgreSQL  │  │ Elastic     │  │ Redis       │          │
│  │ (User Data) │  │ Search      │  │ (Cache)     │          │
│  └─────────────┘  │ Index       │  └─────────────┘          │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```