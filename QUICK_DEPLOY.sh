#!/bin/bash

# BCA Student Portal - Quick Deploy Script
# This script helps you deploy to Render in a few easy steps

echo "🚀 BCA Student Portal - Deployment Helper"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
fi

# Get user input
echo "📝 Enter your GitHub username:"
read GITHUB_USERNAME

echo ""
echo "✅ Ready to deploy! Follow these steps:"
echo ""
echo "1️⃣  Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'BCA Student Portal - Ready for deployment'"
echo "   git push -u origin main"
echo ""
echo "2️⃣  Go to render.com and:"
echo "   - Sign in with GitHub"
echo "   - Connect your BCA repository"
echo "   - Set Root Directory to 'server'"
echo "   - Add environment variables"
echo ""
echo "3️⃣  Your app will be live in 2-3 minutes!"
echo ""
echo "📚 Full instructions in: DEPLOY_RENDER.md"
echo ""
