#!/usr/bin/env python3
"""
Server startup script for Room Renovation API
"""
import uvicorn
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting Room Renovation API Server...")
    print("📝 API Documentation will be available at: http://localhost:8000/docs")
    print("🔍 Interactive API explorer at: http://localhost:8000/redoc")
    print("⚡ Server starting on: http://localhost:8000")
    print("-" * 60)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0", 
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )