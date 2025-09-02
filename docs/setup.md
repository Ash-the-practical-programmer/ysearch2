# YSearch2 - Setup and Running Guide

## Prerequisites

- Python 3.8+
- Node.js 14+
- UV package manager (https://github.com/astral-sh/uv)

## Installation

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

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Search
- `POST /search` - Perform a search query
  - Body: `{"query": "search terms", "user_id": "optional_user_id"}`
  - Response: Search results with personalized rankings

### Agent Status
- `GET /agents/status` - Get the status of all agents in the system

## Project Structure

```
├── backend/              # FastAPI backend services
│   ├── agents/           # Multi-agent implementations
│   ├── ml/               # Machine learning components
│   ├── main.py           # Main application entry point
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend application
│   ├── src/              # Source code
│   ├── package.json      # Node.js dependencies
│   └── nginx.conf        # Nginx configuration
├── tests/                # Test suite
├── docs/                 # Documentation
├── README.md             # Project overview
└── ARCHITECTURE.md       # Detailed system architecture
```

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

## Deployment

For production deployment, you should:

1. Configure proper security settings
2. Set up a reverse proxy (nginx, Apache) for SSL termination
3. Use a production database instead of the development PostgreSQL instance
4. Configure proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.