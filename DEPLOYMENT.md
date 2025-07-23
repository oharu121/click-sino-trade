# 🚀 Deployment Guide - Google Cloud Run (Lowest Cost)

## 📊 Cost Analysis

### Google Cloud Run Pricing (Taiwan Region)

- **CPU**: $0.00002400 per 100ms
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests
- **Free Tier**: 2M requests/month, 360K vCPU-seconds, 180K GiB-seconds

### Estimated Monthly Cost

- **With Cloud Scheduler**: ~$0.50-2.00/month
- **Without Cloud Scheduler**: ~$15-30/month (running 24/7)

## 🛠️ Setup Instructions

### 1. Prerequisites

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
gcloud init

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Environment Variables

Create a `.env` file with your configuration:

```env
# LINE Configuration
LINE_GROUP_ID=your_line_group_id
LINE_ACCESS_TOKEN=your_line_access_token

# Task Configuration
CRON_SCHEDULE=0 * * * *
BROWSER_TIMEOUT=60000
MAX_RETRIES=10
LOG_LEVEL=info

# Health Check
HEALTH_PORT=3000
```

### 3. Deploy to Cloud Run

```bash
# Update PROJECT_ID in deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### 4. Setup Cloud Scheduler (Cost Optimization)

```bash
# Replace YOUR_CLOUD_RUN_URL with your service URL
gcloud scheduler jobs create http sino-trade-trigger \
  --schedule="0 * * * *" \
  --uri="YOUR_CLOUD_RUN_URL" \
  --http-method=POST \
  --time-zone="Asia/Taipei" \
  --max-retry-count=3
```

## 📈 Monitoring Setup

### 1. Cloud Monitoring Dashboard

```bash
# Create monitoring dashboard
gcloud monitoring dashboards create --config-from-file=dashboard.yaml
```

### 2. Logging and Alerts

```bash
# Create log-based alerts
gcloud logging sinks create sino-trade-logs \
  storage.googleapis.com/projects/YOUR_PROJECT/buckets/YOUR_BUCKET \
  --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="sino-trade-cron"'
```

### 3. Cloud Scheduler Monitoring

Monitor your scheduled jobs in the Google Cloud Console:
- **Cloud Scheduler**: View job execution history and success rates
- **Cloud Run**: Monitor container execution logs and performance
- **Cloud Logging**: Centralized logging for all executions

## 🔧 Cost Optimization Tips

### 1. Use Cloud Scheduler Instead of Continuous Running

- **Before**: Container runs 24/7 = ~$30/month
- **After**: Container runs only when needed = ~$2/month

### 2. Optimize Resource Allocation

- **Memory**: 512Mi (sufficient for Playwright)
- **CPU**: 1 vCPU (adequate for browser automation)
- **Max Instances**: 1 (prevents scaling costs)

### 3. Monitor Usage

```bash
# Check current usage
gcloud billing accounts list
gcloud billing budgets create --billing-account=YOUR_ACCOUNT \
  --budget-amount=5USD \
  --threshold-rule=percent=80 \
  --threshold-rule=percent=100
```

## 🚨 Troubleshooting

### Common Issues

1. **Browser Launch Failures**: Ensure headless mode is enabled
2. **Memory Issues**: Increase memory allocation if needed
3. **Timeout Errors**: Adjust BROWSER_TIMEOUT environment variable
4. **LINE Notifications**: Verify LINE_ACCESS_TOKEN is set correctly

### Debug Commands

```bash
# View logs
gcloud logging read 'resource.type="cloud_run_revision"' --limit=50

# Check service status
gcloud run services describe sino-trade-cron --region=asia-east1

# Test service execution
curl -X POST https://YOUR_SERVICE_URL
```

## 📊 Performance Metrics

### Expected Performance

- **Task Execution Time**: 30-120 seconds
- **Memory Usage**: 200-400MB
- **CPU Usage**: 50-80% during execution
- **Success Rate**: >95% with proper error handling

### Monitoring KPIs

- Task execution success rate
- Average execution time
- Memory and CPU utilization
- Error frequency and types
- LINE notification delivery rate
