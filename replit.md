# Overview

YSearch2 is a personalized agentic web search platform that combines multiple AI agents working in coordination to provide intelligent, personalized search experiences. The system has been enhanced with GEPA (Generalized Experience-based Program Adaptation) optimizers for online learning and real-time search result improvement. The platform features a modern Next.js frontend with integrated GEPA optimization dashboard and a FastAPI backend with simplified but functional ML/AI integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The system provides two frontend implementations:
- **Next.js Frontend**: Modern React application using Next.js 15 with App Router, TypeScript, Tailwind CSS, and Radix UI components for a sleek, responsive interface
- **React Frontend**: Alternative implementation with DaisyUI component library for enhanced user experience

Both frontends feature real-time search interfaces, user feedback collection mechanisms, analytics dashboards, and responsive design with dark mode support.

## Backend Architecture
The backend is built on FastAPI (Python) with a multi-agent orchestration system:

- **Agent Orchestrator**: Coordinates multiple specialized AI agents including Search Agents, Reasoning Agents, Ranking Agents, and Personalization Agents
- **GEPA-Enhanced Reasoning**: Advanced reasoning pipeline using DSPy with GEPA optimizers for continuous learning and search result optimization
- **Service Layer**: Modular services for feedback processing, personalization, and metrics collection
- **API Gateway**: RESTful endpoints for search queries, user feedback, metrics, and system health monitoring

## Multi-Agent System Design
The core innovation lies in the distributed agent architecture:

- **Search Agents**: Handle multi-modal search using Tencent/Youtu-agent for text and image queries
- **Reasoning Agents**: Process queries using DSPy pipelines for intent analysis and query expansion
- **Personalization Agents**: Manage user profiles, preferences, and behavioral patterns
- **Ranking Agents**: Score and reorder results based on relevance and personalization
- **GEPA Agents**: Provide continuous optimization through reinforcement learning

## Machine Learning Pipeline
The system implements several advanced ML frameworks:

- **DSPy Integration**: Structured prompting and reasoning pipelines for natural language processing
- **SSRL Framework**: Self-Search Reinforcement Learning for continuous system improvement based on user interactions
- **GEPA Optimization**: Online learning algorithms that adapt search behavior in real-time
- **Multi-modal Processing**: Support for text, image, and voice-based search queries

## Data Architecture
User data and system state are managed through:

- **User Profiles**: JSON-based storage for preferences, search history, and feedback scores
- **Metrics Collection**: Comprehensive tracking of search performance, agent processing times, and user engagement
- **Feedback Processing**: Real-time collection and batch processing of user interactions for model training

# External Dependencies

## Core Technologies
- **FastAPI**: Python web framework for high-performance API development
- **React/Next.js**: Frontend frameworks for building responsive user interfaces
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework with DaisyUI and Radix UI components

## AI/ML Libraries
- **DSPy**: Framework for building and optimizing language model pipelines
- **Tencent/Youtu-agent**: Multi-modal search capabilities for text and image processing
- **Custom SSRL Implementation**: Self-supervised reinforcement learning framework

## Database and Storage
- **PostgreSQL**: Primary database for user profiles and persistent data storage (configurable)
- **Redis**: Caching layer for search results and session management
- **Elasticsearch**: Search indexing and full-text search capabilities
- **JSON File Storage**: Lightweight storage for development and smaller deployments

## Development Tools
- **UV Package Manager**: Fast Python dependency management
- **Pytest**: Testing framework for backend services
- **ESLint/Prettier**: Code quality and formatting tools for frontend development

## Infrastructure Services
- **SWR**: Data fetching and caching for React applications
- **CORS Middleware**: Cross-origin resource sharing configuration
- **Uvicorn**: ASGI server for running FastAPI applications

The system is designed to be cloud-agnostic and can be deployed on various platforms including AWS, Google Cloud, or Azure with appropriate service substitutions for databases and caching layers.