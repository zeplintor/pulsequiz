#!/bin/bash

# PulseQuiz Firebase Setup Script
echo "🔥 Setting up Firebase for PulseQuiz..."
echo ""

PROJECT_ID="pulsequiz-1769969796"

echo "📋 Project Information:"
echo "   Project ID: $PROJECT_ID"
echo "   Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo ""

# Check if Firestore API is enabled
echo "⏳ Checking if Firestore is enabled..."
firebase firestore:databases:list --project $PROJECT_ID 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Firestore is enabled!"
  echo ""
  echo "🚀 Deploying Firestore rules..."
  firebase deploy --only firestore:rules --project $PROJECT_ID

  if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully!"
  else
    echo "❌ Failed to deploy Firestore rules"
    exit 1
  fi
else
  echo "⚠️  Firestore needs to be enabled manually."
  echo ""
  echo "📝 Follow these steps:"
  echo "   1. Opening Firebase Console..."
  open "https://console.firebase.google.com/project/$PROJECT_ID/firestore"
  echo "   2. Click 'Create database' button"
  echo "   3. Choose 'Start in production mode'"
  echo "   4. Select 'us-central1' as location"
  echo "   5. Click 'Enable'"
  echo ""
  echo "   Then run this script again!"
  exit 1
fi

echo ""
echo "🔑 Next steps:"
echo "   1. Get your Firebase config from:"
echo "      https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
echo "   2. Add your Web App (click the </> icon)"
echo "   3. Copy the config values to .env.local"
echo ""
echo "✨ Firebase setup complete!"
