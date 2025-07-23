#!/bin/bash

# Google Cloud Run Deployment Script
# Optimized for lowest cost deployment

set -e

# Configuration
PROJECT_ID="your-project-id"  # Replace with your GCP project ID
SERVICE_NAME="sino-trade-cron"
REGION="asia-east1"  # Taiwan region for lower latency
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying to Google Cloud Run..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME .

# Push to Google Container Registry
echo "📤 Pushing to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run with cost optimization
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 1 \
  --min-instances 0 \
  --concurrency 1 \
  --timeout 600 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "BROWSER_TIMEOUT=60000" \
  --set-env-vars "MAX_RETRIES=10" \
  --set-env-vars "LOG_LEVEL=info"

echo "✅ Deployment complete!"
echo "🌐 Service URL: $(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')"
echo "📊 Monitoring: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME" 