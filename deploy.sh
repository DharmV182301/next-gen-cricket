#!/bin/bash
echo "🏏 Quantum Cricket Deployment Script 🏏"
echo "---------------------------------------"
echo "1. We are going to log you into Google/Firebase."
echo "   (A browser window will open. Please sign in!)"
echo "---------------------------------------"

# Login
npx firebase-tools login

echo "---------------------------------------"
echo "2. Login successful! Now deploying your game..."
echo "---------------------------------------"

# Deploy
npx firebase-tools deploy

echo "---------------------------------------"
echo "✅ DONE! Your game should now be live."
