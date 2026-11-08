# CodeSphere Disaster Recovery & Backup Strategy

Comprehensive guide for backup, recovery, and disaster management.

---

## 📋 Table of Contents

1. [Backup Strategy](#backup-strategy)
2. [Recovery Procedures](#recovery-procedures)
3. [Disaster Scenarios](#disaster-scenarios)
4. [Business Continuity](#business-continuity)

---

## Backup Strategy

### 1. Database Backups

#### MongoDB Atlas (Recommended for Production)

**Automatic Backups**:
- Daily snapshots (automated by MongoDB Atlas)
- 7-day retention for Free tier
- 35-day retention for M10+ tier

**Manual Backup**:

```bash
# Full database backup
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/codesphere" \
          --out ./backups/codesphere-$(date +%Y%m%d)

# Backup specific collection
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/codesphere" \
          --collection SandboxProject \
          --out ./backups/sandbox-$(date +%Y%m%d)
```

**Restore from Backup**:

```bash
# Restore full database
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net" \
             ./backups/codesphere-20240725

# Restore specific collection
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/codesphere" \
             --collection SandboxProject \
             ./backups/sandbox-20240725/codesphere/SandboxProject.bson
```

#### Self-Hosted MongoDB Backup Script

```bash
#!/bin/bash
# backup-mongodb.sh

BACKUP_DIR="./backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_URI="mongodb://localhost:27017"
ARCHIVE_NAME="codesphere_$DATE.tar.gz"

# Create backup
mongodump --uri "$MONGO_URI" --out "$BACKUP_DIR/dump_$DATE"

# Compress
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" "$BACKUP_DIR/dump_$DATE"

# Clean up
rm -rf "$BACKUP_DIR/dump_$DATE"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/$ARCHIVE_NAME" s3://codesphere-backups/

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $ARCHIVE_NAME"
```

**Schedule with Cron**:

```bash
# Daily backup at 2 AM
0 2 * * * /home/app/scripts/backup-mongodb.sh

# Backup every 6 hours
0 */6 * * * /home/app/scripts/backup-mongodb.sh
```

### 2. File Storage Backups (AWS S3)

#### Automated S3 Backup Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::codesphere-uploads",
        "arn:aws:s3:::codesphere-uploads/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::codesphere-backups/*"
    }
  ]
}
```

#### S3 Versioning & Lifecycle

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket codesphere-uploads \
  --versioning-configuration Status=Enabled

# Set lifecycle policy (archive old versions)
aws s3api put-bucket-lifecycle-configuration \
  --bucket codesphere-uploads \
  --lifecycle-configuration '{
    "Rules": [
      {
        "Id": "Archive30Days",
        "Status": "Enabled",
        "NoncurrentVersionTransitions": [
          {
            "NoncurrentDays": 30,
            "StorageClass": "GLACIER"
          }
        ],
        "NoncurrentVersionExpiration": {
          "NoncurrentDays": 90
        }
      }
    ]
  }'
```

### 3. Redis Cache Backup

```bash
# Manual backup
docker exec codesphere-redis redis-cli BGSAVE

# Backup RDB file
docker exec codesphere-redis redis-cli --rdb /data/codesphere-$(date +%Y%m%d).rdb

# Backup to S3
aws s3 cp /path/to/dump.rdb s3://codesphere-backups/redis/
```

### 4. Application Code Backup

Handled automatically by Git repository:

```bash
# Daily backup to GitHub
git push origin main --mirror

# Create backup archive
tar -czf codesphere-code-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=uploads \
  ./Codesphere

# Upload to S3
aws s3 cp codesphere-code-*.tar.gz s3://codesphere-backups/code/
```

### 5. Backup Verification

```bash
#!/bin/bash
# verify-backups.sh

echo "Checking backup integrity..."

# Check MongoDB backup
mongorestore --archive=./backups/codesphere_latest.archive --nsFrom="*.*" --nsTo="test.*" --dryRun

# Check file sizes
du -sh ./backups/

# Check S3 backups
aws s3 ls s3://codesphere-backups/ --recursive --summarize

# Check backup age
find ./backups -type f -mtime +7 -name "*.tar.gz" | wc -l
```

---

## Recovery Procedures

### Database Recovery

#### Scenario: Data Corruption

```bash
# 1. Identify latest good backup
aws s3 ls s3://codesphere-backups/mongodb/ | tail -5

# 2. Download backup
aws s3 cp s3://codesphere-backups/mongodb/codesphere_20240724.archive ./

# 3. Create test database
# (restore to separate database first to verify)
mongorestore --archive=codesphere_20240724.archive \
             --nsFrom="codesphere.*" \
             --nsTo="codesphere_test.*"

# 4. Verify data integrity
mongo --eval "db.getSiblingDB('codesphere_test').getCollectionNames()"

# 5. If verified, restore to production
mongorestore --archive=codesphere_20240724.archive \
             --drop  # Remove existing collections first
```

#### Scenario: Accidental Deletion

```bash
# 1. Check if document exists in backup
mongorestore --archive=codesphere_20240724.archive \
             --nsFrom="codesphere.SandboxProject" \
             --nsTo="codesphere_recovery.SandboxProject"

# 2. Query recovered collection
db.getSiblingDB('codesphere_recovery').SandboxProject.findOne({_id: deletedId})

# 3. Copy back to production
db.getSiblingDB('codesphere_recovery').SandboxProject.find().forEach(function(doc) {
  db.getSiblingDB('codesphere').SandboxProject.insertOne(doc)
})
```

### File Recovery

```bash
# 1. List deleted files in S3
aws s3api list-object-versions \
  --bucket codesphere-uploads \
  --prefix "workspaces/" \
  --query 'DeleteMarkers[?IsLatest==`true`]' \
  --output table

# 2. Restore specific file
aws s3api delete-object \
  --bucket codesphere-uploads \
  --key "workspaces/deleted-workspace.zip" \
  --version-id "version-id-here"

# 3. Or restore entire directory from previous version
aws s3 sync s3://codesphere-backup-glacier/workspaces/ \
        s3://codesphere-uploads/workspaces/
```

### Application Recovery

```bash
# 1. Stop current application
docker-compose down

# 2. Restore code from archive
tar -xzf codesphere-code-20240724.tar.gz

# 3. Update dependencies
cd server && npm install && cd ../client && npm install

# 4. Restore database
mongorestore --archive=codesphere_20240724.archive --drop

# 5. Restart application
docker-compose up -d
```

---

## Disaster Scenarios

### Scenario 1: Complete Server Failure

**Recovery Time Objective (RTO)**: 2 hours
**Recovery Point Objective (RPO)**: 1 hour

```bash
# 1. Provision new server
# - AWS EC2, Heroku, or Render
# - Copy environment variables

# 2. Deploy application
git clone https://github.com/your-repo/Codesphere.git
cd Codesphere/server && npm install

# 3. Restore data
aws s3 cp s3://codesphere-backups/mongodb/latest.archive ./
mongorestore --archive=latest.archive --drop

# 4. Restore files
aws s3 sync s3://codesphere-backups/files/ ./uploads/

# 5. Start services
npm start

# Total time: ~1-2 hours
```

### Scenario 2: Database Corruption

**Recovery Time**: 30 minutes

```bash
# 1. Stop application (prevent writes)
systemctl stop codesphere-server

# 2. Create backup of corrupted data
mongodump --out ./corrupted-data-20240725

# 3. Restore from last known good backup
mongorestore --archive=codesphere_20240724.archive --drop

# 4. Verify integrity
npm run test  # Run full test suite

# 5. Resume application
systemctl start codesphere-server

# 6. Monitor for issues
curl http://localhost:5000/health
```

### Scenario 3: Data Loss Due to Ransomware

**Prevention**:
```
1. Use immutable backups (S3 Object Lock)
2. Separate backup credentials
3. Air-gapped backup copy
4. Regular restore testing
```

**Recovery**:
```bash
# 1. Isolate affected systems immediately
docker-compose down

# 2. Restore from encrypted, off-site backup
# Using S3 Object Lock (immutable for 90 days)
aws s3 cp s3://codesphere-backups-locked/codesphere_clean.archive ./

# 3. Verify signatures before restore
openssl dgst -sha256 -verify public.key -signature file.sig codesphere_clean.archive

# 4. Restore on isolated network
mongorestore --archive=codesphere_clean.archive

# 5. Scan for malware
clamscan -r ./uploads/

# 6. Bring online with monitoring
docker-compose up -d
```

### Scenario 4: Prolonged Service Outage

**Automatic Failover Setup**:

```yaml
# docker-compose.failover.yml
version: '3.8'
services:
  server-primary:
    image: codesphere-server
    ports: ["5000:5000"]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: always

  server-secondary:
    image: codesphere-server
    ports: ["5001:5000"]
    profiles:
      - failover  # Manual activation
    restart: always

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx-failover.conf:/etc/nginx/nginx.conf
    depends_on:
      - server-primary
      - server-secondary
```

**Nginx Failover Config**:

```nginx
upstream codesphere {
  server server-primary:5000 weight=100 max_fails=3 fail_timeout=10s;
  server server-secondary:5000 weight=100 backup;
}

server {
  listen 80;
  server_name api.codesphere.dev;
  
  location / {
    proxy_pass http://codesphere;
    proxy_set_header Host $host;
    proxy_connect_timeout 5s;
    proxy_send_timeout 10s;
    proxy_read_timeout 10s;
  }
}
```

---

## Business Continuity

### Backup Schedule

| Component | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| MongoDB | Daily | 30 days | MongoDB Atlas + S3 |
| Redis | Daily | 7 days | S3 |
| Files (S3) | Continuous versioning | 90 days | S3 Versioning |
| Code | Per commit | Unlimited | GitHub + S3 |
| Logs | Daily | 30 days | CloudWatch/Datadog |

### Recovery Testing

```bash
#!/bin/bash
# monthly-dr-test.sh

echo "Monthly Disaster Recovery Test"
echo "Date: $(date)"

# 1. Test database backup
echo "Testing database restore..."
mongorestore --archive=codesphere_latest.archive \
             --nsFrom="codesphere.*" \
             --nsTo="dr_test.*" \
             --dryRun

# 2. Test file restore
echo "Testing file restore..."
aws s3 ls s3://codesphere-backups/ --recursive

# 3. Test application startup
echo "Testing application startup..."
docker-compose up --dry-run

# 4. Verify all tests passed
if [ $? -eq 0 ]; then
  echo "✓ DR Test Passed"
  echo "Backup Status: OK"
else
  echo "✗ DR Test FAILED - Investigate immediately"
  exit 1
fi
```

**Schedule for First Monday of Each Month**:

```bash
# Add to crontab
0 9 1 * 1 /home/app/scripts/monthly-dr-test.sh | mail -s "DR Test Results" admin@codesphere.dev
```

### Monitoring & Alerting

```javascript
// services/monitoring.backup.js
const cron = require('node-cron');
const aws = require('aws-sdk');

// Check backup freshness daily
cron.schedule('0 1 * * *', async () => {
  const s3 = new aws.S3();
  const backups = await s3.listObjects({
    Bucket: 'codesphere-backups',
    MaxKeys: 1
  }).promise();

  const lastBackup = backups.Contents[0];
  const ageHours = (Date.now() - lastBackup.LastModified) / (1000 * 60 * 60);

  if (ageHours > 25) {
    // Alert if backup is older than 25 hours
    console.error(`ALERT: Last backup is ${ageHours.toFixed(1)} hours old`);
    // Send alert to Slack/PagerDuty
  }
});
```

### Runbook

**Create `/docs/RUNBOOK.md`**:

```markdown
# Emergency Procedures Runbook

## All Services Down
1. SSH into server
2. Check: `docker-compose ps`
3. Restart: `docker-compose up -d`
4. If still down, proceed to full recovery

## Database Unreachable
1. Check: `docker logs codesphere-mongodb`
2. Try restart: `docker-compose restart mongodb`
3. If fails, follow "Complete Server Failure" scenario

## Memory Usage Critical
1. Check: `docker stats`
2. Clear cache: `docker exec codesphere-redis redis-cli FLUSHALL`
3. Restart: `docker-compose restart server`

## Contact
- On-Call: @devops-oncall (Slack)
- Escalation: @engineering-lead
```

---

**Backup Verification**: Last verified July 25, 2024
**Next Test**: August 1, 2024
