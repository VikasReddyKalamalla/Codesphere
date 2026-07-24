# CodeSphere Deployment Checklist

Complete this checklist before deploying to production.

---

## ✅ Pre-Deployment Phase (Week 1)

### Code Quality
- [ ] Run `npm test` - all tests passing
- [ ] Run `npm run lint` - no linting errors
- [ ] Code review completed
- [ ] No console.log in production code
- [ ] Error handling comprehensive

### Dependencies
- [ ] All npm packages up to date
- [ ] No security vulnerabilities: `npm audit`
- [ ] Package versions pinned (not ranges)
- [ ] Dev dependencies excluded from production build

### Configuration
- [ ] `.env.example` completed with all variables
- [ ] Production `.env` created (not committed to git)
- [ ] All required API keys obtained:
  - [ ] Judge0 API key (RapidAPI)
  - [ ] MongoDB connection string
  - [ ] Redis URL or Upstash token
  - [ ] JWT secret (strong random string)
  - [ ] Sentry DSN (optional but recommended)
- [ ] CORS origins configured correctly
- [ ] Database name correct for production

### Database
- [ ] MongoDB user created with strong password
- [ ] Database backups configured
- [ ] Indexes created: `npm run db:index`
- [ ] Database connection verified
- [ ] Replica set enabled (for multi-instance)

### Security
- [ ] HTTPS certificates obtained
- [ ] SSL/TLS configured
- [ ] Secrets not in codebase
- [ ] API rate limits configured
- [ ] CORS properly restricted
- [ ] CSRF protection enabled
- [ ] Security headers (Helmet) enabled

---

## ✅ Docker Setup Phase (Week 1-2)

### Docker Configuration
- [ ] `Dockerfile` reviewed and optimized
- [ ] `docker-compose.yml` configured for production
- [ ] Environment variables in `.env`
- [ ] Volumes for persistent data configured
- [ ] Network isolation verified

### Build & Test
- [ ] Docker image builds successfully
- [ ] `docker-compose up -d` starts all services
- [ ] All containers healthy: `docker-compose ps`
- [ ] Health endpoint responds: `curl /health`
- [ ] Database is accessible from container
- [ ] Redis is accessible from container

### Docker Registry
- [ ] Docker Hub or GitHub Container Registry account ready
- [ ] Image tagged properly: `codesphere-server:v1.0.0`
- [ ] Image pushed to registry: `docker push`
- [ ] Image pull verified: `docker pull`

---

## ✅ Integration Testing Phase (Week 2)

### Core Features
- [ ] Code execution works via Judge0
  ```bash
  curl -X POST http://localhost:5000/api/execute/run \
    -H "Authorization: Bearer TOKEN" \
    -d '{"code":"console.log(1);","language":"javascript"}'
  ```
- [ ] All 9 languages supported
- [ ] Rate limiting enforced (10 req/min)
- [ ] Test cases execute correctly

### API Endpoints
- [ ] Authentication working (`/api/auth`)
- [ ] Code execution working (`/api/execute`)
- [ ] Sandbox endpoints working (`/api/sandbox`)
- [ ] Health check working (`/health`)
- [ ] Swagger UI accessible (`/api-docs`)

### Database
- [ ] User creation & login working
- [ ] Data persists after restart
- [ ] Database queries performant
- [ ] Indexes being used (explain plans)

### Cache & Performance
- [ ] Redis connection working
- [ ] Cache hits occurring
- [ ] Response times acceptable (<200ms)
- [ ] Memory usage stable

### Monitoring
- [ ] Sentry errors captured
- [ ] Health endpoint returning correct data
- [ ] Logs being generated
- [ ] Performance metrics available

---

## ✅ Staging Deployment Phase (Week 2-3)

### Pre-Staging
- [ ] Staging server provisioned
- [ ] Staging DNS configured
- [ ] Staging certificates obtained
- [ ] Staging database created & backed up
- [ ] Staging Redis provisioned

### Staging Deployment
- [ ] Clone repository on staging
- [ ] Copy `.env.staging` with staging values
- [ ] Build Docker images
- [ ] Start services: `docker-compose up -d`
- [ ] Verify all services running
- [ ] Test health endpoint
- [ ] Run full integration test suite

### Staging Verification
- [ ] Users can sign up
- [ ] Users can run code
- [ ] Sandbox projects accessible
- [ ] Code execution working
- [ ] Payments processing (test mode)
- [ ] Emails sending (test addresses)
- [ ] All API endpoints accessible

### Load Testing (Staging)
- [ ] Run load tests: `npm run load-test`
  - 100 concurrent users
  - 5 minute duration
  - Monitor memory & CPU
- [ ] Response times acceptable
- [ ] No errors under load
- [ ] Rate limiting working

### Staging Monitoring
- [ ] Sentry receiving errors
- [ ] Health checks passing
- [ ] Database backups running
- [ ] Logs being collected
- [ ] Monitoring alerts configured

---

## ✅ Production Preparation Phase (Week 3-4)

### Production Infrastructure
- [ ] Production servers provisioned
  - [ ] 2+ instances for load balancing
  - [ ] Auto-scaling configured
  - [ ] Load balancer configured
- [ ] Production MongoDB (dedicated tier)
  - [ ] Replication enabled
  - [ ] Backup automated
  - [ ] Monitoring enabled
- [ ] Production Redis
  - [ ] High availability enabled
  - [ ] Backup strategy implemented
- [ ] Production DNS configured
- [ ] Production SSL certificates obtained

### Production Monitoring
- [ ] Sentry production project created
- [ ] PagerDuty/alerting configured
- [ ] Monitoring dashboards created
- [ ] Log aggregation configured (CloudWatch/ELK)
- [ ] APM tool configured (optional)

### Production Backup
- [ ] Database backup schedule created
- [ ] File backup schedule created
- [ ] Backup verification automated
- [ ] Recovery procedures tested
- [ ] Disaster recovery plan reviewed

### Production Documentation
- [ ] Runbook created (`RUNBOOK.md`)
- [ ] Escalation procedures defined
- [ ] On-call rotation setup
- [ ] Access credentials secured
- [ ] Documentation reviewed by team

---

## ✅ Production Deployment Phase (Day 1)

### Pre-Deployment (6 hours before)
- [ ] Team notified of deployment window
- [ ] Status page updated
- [ ] Rollback plan reviewed
- [ ] Team on standby
- [ ] Monitoring dashboards open

### Deployment Execution
- [ ] Create backup of production database
- [ ] Create backup of production files
- [ ] Verify backups completed successfully
- [ ] Scale down services (if needed for updates)
- [ ] Deploy new code to production
- [ ] Verify deployment succeeded
- [ ] Run smoke tests
- [ ] Monitor error rates (0 new errors)
- [ ] Check performance metrics
- [ ] Verify all endpoints responding
- [ ] Check health endpoint

### Post-Deployment (4 hours)
- [ ] Monitor error logs closely
- [ ] Monitor performance metrics
- [ ] User testing of key features
- [ ] Database query monitoring
- [ ] Memory/CPU usage within limits
- [ ] All 3 critical features working:
  - [ ] Code execution
  - [ ] User authentication
  - [ ] Course/content delivery
- [ ] Announce deployment complete

### Monitoring (24 hours post-deployment)
- [ ] Monitor error rate
- [ ] Monitor performance
- [ ] Monitor user signups
- [ ] Monitor code executions
- [ ] Check database performance
- [ ] Review Sentry for issues
- [ ] Review logs for warnings

---

## ✅ Post-Deployment Phase (Week 4+)

### Day 1 Verification
- [ ] All critical paths tested
- [ ] No unusual error rates
- [ ] Performance within SLA
- [ ] Users reporting no issues
- [ ] Status page shows "Operational"

### Week 1 Monitoring
- [ ] Daily monitoring of key metrics
- [ ] Weekly backup verification
- [ ] Performance trending stable
- [ ] No critical issues reported
- [ ] Security scan passed

### Ongoing Operations
- [ ] Database maintenance schedule
- [ ] Log rotation configured
- [ ] Backup verification weekly
- [ ] Security patches monitored
- [ ] Performance optimization ongoing
- [ ] User feedback collected
- [ ] Incident response plan ready

---

## 🔧 Troubleshooting During Deployment

### If Deployment Fails
1. [ ] Check error logs: `docker-compose logs`
2. [ ] Verify all environment variables set
3. [ ] Rollback to previous version
4. [ ] Debug specific service
5. [ ] Restore from backup if needed

### If Code Execution Fails
1. [ ] Verify Judge0 API key valid
2. [ ] Check Judge0 API status
3. [ ] Verify network connectivity to Judge0
4. [ ] Fall back to mock results
5. [ ] Review Judge0 documentation

### If Database Connection Fails
1. [ ] Verify MongoDB URI correct
2. [ ] Check database credentials
3. [ ] Verify network access
4. [ ] Restart MongoDB service
5. [ ] Restore from backup

### If Performance Issues
1. [ ] Check database indexes
2. [ ] Monitor query performance
3. [ ] Check cache hit rate
4. [ ] Scale up resources if needed
5. [ ] Review slow query logs

---

## 📞 Deployment Team Roles

| Role | Responsibilities |
|------|------------------|
| **Deployment Lead** | Executes deployment, makes decisions |
| **Database Admin** | Manages DB backups, migrations |
| **DevOps Engineer** | Monitors infrastructure, handles issues |
| **QA Lead** | Verifies features, runs tests |
| **On-Call** | Responds to production issues |

---

## 📋 Sign-Off

**Pre-Deployment Review**: _______________  Date: _______

**Staging Approved**: _______________  Date: _______

**Production Approved**: _______________  Date: _______

**Deployment Complete**: _______________  Date: _______

---

## 📞 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Deployment Lead | | | |
| Database Admin | | | |
| DevOps Engineer | | | |
| Engineering Lead | | | |

---

## ✨ Key Reminders

1. **Never skip tests** - Run `npm test` before deployment
2. **Always backup first** - Database and files
3. **Monitor closely** - First 24 hours are critical
4. **Have rollback plan** - Know how to revert
5. **Communicate** - Keep team informed
6. **Document issues** - For post-mortem
7. **Celebrate success** - Deployment went well!

---

**Checklist Version**: 1.0  
**Last Updated**: July 25, 2024  
**Next Review**: August 25, 2024
