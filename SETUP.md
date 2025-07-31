# AI Fitness Workout Logger - Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (if needed)
FIREBASE_PROJECT_ID=your_firebase_project_id

# Backend Port
PORT=3001
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

## Running the Application

### Option 1: Run Frontend and Backend Separately

1. Start the backend server:
```bash
npm run backend
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

### Option 2: Run Both Together

```bash
npm run dev:full
```

## Troubleshooting

### Firebase Error: "Cannot read properties of undefined (reading 'indexOf')"
This error occurs when the URL parameters `userId` or `planId` are missing. Make sure you're navigating to the correct URL format:
```
/plan/:userId/:planId
```

### Firebase Error: "Missing or insufficient permissions"
This error occurs when trying to access Firestore without authentication. **FIXED**: The application now uses the backend API to fetch data, which has admin privileges and bypasses authentication requirements.

### Backend Connection Error: "ERR_CONNECTION_REFUSED"
This error occurs when the backend server is not running. Make sure to:
1. Start the backend server first: `npm run backend`
2. Check that the backend is running on port 3001
3. Verify that the .env file has the correct configuration

### OpenAI API Error
Make sure your OpenAI API key is valid and has sufficient credits for API calls. 