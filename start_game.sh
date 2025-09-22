#!/bin/bash
# Morpion Otaku Battle - Linux/Mac Startup Script

echo "🎮 Starting Morpion Otaku Battle..."
echo "🔍 Checking Python installation..."

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ and try again."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null
then
    echo "❌ pip is not installed. Please install pip and try again."
    exit 1
fi

echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

echo "🚀 Starting the game server..."
echo "🌐 Open your browser and go to: http://localhost:5000"
echo "🎯 Press Ctrl+C to stop the server"
echo ""

python3 app.py