# YSearch2 - Personalized Agentic Web Search Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18%2B-blue.svg)](https://reactjs.org/)

YSearch2 is an advanced web search platform that leverages multiple AI agents working in coordination to provide personalized search results. The system combines multi-modal search capabilities, AI reasoning pipelines, and online learning to continuously improve search quality for each user.

## Features

- **Multi-Agent Architecture**: Distributed system with specialized agents for search, reasoning, ranking, and learning
- **Multi-Modal Search**: Text and image-based search using Tencent/Youtu-agent
- **AI Reasoning Pipelines**: Natural language processing and logical reasoning with DSPy
- **Personalization**: User-specific search results based on preferences and behavior
- **Online Learning**: Continuous improvement through SSRL (Self-Search Reinforcement Learning)
- **High Performance**: Fast Python package management with UV
- **Real-time Feedback**: Interactive feedback mechanisms for continuous learning
- **Comprehensive Monitoring**: Built-in metrics and monitoring capabilities
- **Modern UI**: Enhanced user interface with DaisyUI component library

## Architecture

![System Architecture](ARCHITECTURE.md)

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: FastAPI (Python), Redis for caching
- **Database**: PostgreSQL for user data, Elasticsearch for search index
- **AI/ML**: DSPy, Tencent/Youtu-agent, Custom SSRL Implementation
- **Package Management**: UV for Python dependency management

## Project Structure

```
├── backend/              # FastAPI backend services
│   ├── agents/           # Multi-agent implementations
│   ├── api/              # API endpoints
│   ├── services/         # Business logic services
│   ├── ml/               # Machine learning components
│   ├── models/           # Database models
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── main.py           # Main application entry point
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   └── pages/        # Page components
│   ├── package.json      # Node.js dependencies
│   └── nginx.conf        # Nginx configuration
├── ml/                   # Machine learning components
│   ├── dspy_pipelines/   # DSPy AI reasoning pipelines
│   ├── ssrl/             # SSRL online learning implementation
│   └── youtu_integration/# Tencent/Youtu-agent integration
├── tests/                # Test suite
├── docs/                 # Documentation
├── README.md             # This file
└── ARCHITECTURE.md       # Detailed system architecture
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- UV package manager (https://github.com/astral-sh/uv)

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using UV:
   ```bash
   uv pip install -r requirements.txt
   ```

3. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will be available at: http://localhost:8000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at: http://localhost:3000

## UI Enhancements

The frontend has been enhanced with DaisyUI, a component library for Tailwind CSS that provides:

- **Pre-designed Components**: Cards, buttons, badges, and more
- **Responsive Design**: Adapts to all screen sizes
- **Dark Mode Support**: Toggle between light and dark themes
- **Customizable Themes**: Easy theme customization
- **Accessibility**: WCAG compliant components

For more details on UI enhancements, see [UI Enhancements Documentation](docs/ui-enhancements.md).

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Search
- `POST /search` - Perform a search query
  - Body: `{"query": "search terms", "user_id": "optional_user_id"}`
  - Response: Search results with personalized rankings

### Agent Status
- `GET /agents/status` - Get the status of all agents in the system

### Feedback
- `POST /feedback` - Record user feedback on search results
- `POST /process_feedback` - Process accumulated feedback for learning
- `GET /feedback/recent` - Get recent feedback entries

### Metrics
- `GET /metrics` - Get system performance metrics
- `POST /metrics/flush` - Flush metrics to persistent storage

## Documentation

- [Architecture](ARCHITECTURE.md) - Detailed system architecture
- [Setup Guide](docs/setup.md) - Installation and setup instructions
- [Deployment Guide](docs/deployment.md) - Deployment options and best practices
- [Monitoring](docs/monitoring.md) - Monitoring and evaluation methods
- [UI Enhancements](docs/ui-enhancements.md) - Frontend UI improvements

## Development

### Running Tests

To run the backend tests:
```bash
cd backend
pytest
```

### Adding New Features

1. For backend features:
   - Add new agents in `backend/agents/`
   - Extend the orchestrator in `backend/agents/orchestrator.py`
   - Add new endpoints in `backend/main.py`

2. For frontend features:
   - Add new components in `frontend/src/components/`
   - Add new pages in `frontend/src/pages/`
   - Update routing in `frontend/src/App.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tencent/Youtu-agent](https://github.com/Tencent/Youtu-agent) for multi-modal search capabilities
- [Stanford DSPy](https://github.com/stanfordnlp/dspy) for AI reasoning pipelines
- [SSRL Framework](https://www.alphaxiv.org/overview/2508.10874v1) for online learning
- [UV](https://github.com/astral-sh/uv) for fast Python package management
- [DaisyUI](https://daisyui.com) for the component library