# Google Cloud Run Deployment Script for Windows
# Optimized for lowest cost deployment

# Configuration
$PROJECT_ID = "sino-trade-automation"  # Replace with your GCP project ID
$SERVICE_NAME = "sino-trade-cron"
$REGION = "asia-east1"  # Taiwan region for lower latency
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Deploying to Google Cloud Run..." -ForegroundColor Green

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t $IMAGE_NAME .

# Push to Google Container Registry
Write-Host "Pushing to Google Container Registry..." -ForegroundColor Yellow
docker push $IMAGE_NAME

# Deploy to Cloud Run with cost optimization
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --max-instances 1 `
  --min-instances 0 `
  --concurrency 1 `
  --timeout 600 `
  --port 8080 `
  --set-env-vars "NODE_ENV=production" `
  --set-env-vars "BROWSER_TIMEOUT=60000" `
  --set-env-vars "MAX_RETRIES=10" `
  --set-env-vars "LOG_LEVEL=info"

Write-Host "Deployment complete!" -ForegroundColor Green
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
Write-Host "Service URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host "Monitoring: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME" -ForegroundColor Cyan 