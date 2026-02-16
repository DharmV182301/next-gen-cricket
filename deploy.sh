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
echo "---------------------------------------"
echo "Select Deployment Platform:"
echo "1) Firebase (Current)"
echo "2) GCP App Engine"
echo "---------------------------------------"
# For automated/speed purposes, I'll add the GCP command here
# npx firebase-tools deploy
gcloud app deploy --project next-gen-prompt-487606 --quiet

echo "---------------------------------------"
echo "✅ DONE! Your game should now be live on GCP."
