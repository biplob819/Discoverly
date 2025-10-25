# Production Deployment Guide

## Overview
This guide covers deploying the Discoverly beta testing platform to production on Vercel with a PostgreSQL database.

## Prerequisites

### 1. Database Setup
- **Recommended**: Use Neon PostgreSQL (https://neon.tech) for seamless Vercel integration
- **Alternative**: Any PostgreSQL provider (Supabase, PlanetScale, AWS RDS, etc.)

### 2. Authentication Setup
- Create a Stack Auth project at https://stack-auth.com
- Configure your domain and callback URLs
- Get your project credentials

## Deployment Steps

### 1. Database Migration
Run the database migrations in order:

```bash
# Main schema
psql $DATABASE_URL -f database/schema.sql

# Beta testing features
psql $DATABASE_URL -f database/migrations/beta_testing_feature.sql

# Enhancements for our modal features
psql $DATABASE_URL -f database/migrations/beta_testing_enhancements.sql

# Seed data (optional)
psql $DATABASE_URL -f database/seed.sql
psql $DATABASE_URL -f database/seed_beta_programs.sql
```

### 2. Environment Variables
Set the following environment variables in Vercel:

```bash
# Database
DATABASE_URL="postgresql://..."

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID="your-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-key"
STACK_SECRET_SERVER_KEY="your-secret"
NEXT_PUBLIC_STACK_URL="https://api.stack-auth.com"

# Application
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 3. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`
3. Set environment variables
4. Deploy

### 4. Stack Auth Configuration
In your Stack Auth dashboard:
1. Add your Vercel domain to allowed origins
2. Configure callback URLs:
   - Sign-in: `https://your-domain.vercel.app/handler/sign-in`
   - Sign-up: `https://your-domain.vercel.app/handler/sign-up`
   - Sign-out: `https://your-domain.vercel.app/handler/sign-out`

## Performance Optimizations

### Database Optimizations
- Enable connection pooling
- Set up read replicas for heavy read operations
- Create appropriate indexes (already included in migrations)

### Caching
- Vercel Edge Functions cache static content automatically
- Consider Redis for user session caching (optional)

### Monitoring
- Enable Vercel Analytics
- Set up error tracking (Sentry recommended)
- Monitor database performance

## Beta Testing Features Checklist

✅ **Core Features Implemented:**
- [x] Beta program creation with comprehensive modal
- [x] User registration and approval flow
- [x] Feedback submission system
- [x] Points and rewards tracking
- [x] Leaderboard system
- [x] Profile management with beta tracking
- [x] Campaign timeline and requirements
- [x] Automatic login routing for join beta flow

✅ **Database Schema:**
- [x] Beta programs table with all required fields
- [x] Beta testers with status tracking
- [x] Feedback system with categories
- [x] Points and rewards tracking
- [x] Feature voting system
- [x] Materialized leaderboard view

✅ **UI/UX Improvements:**
- [x] Modern, minimalist leaderboard design
- [x] Comprehensive launch modal with tabs
- [x] Profile integration with beta programs
- [x] Responsive design for all components

## Maintenance

### Regular Tasks
1. **Refresh Leaderboard**: Run `SELECT refresh_leaderboard();` weekly
2. **Clean up expired beta programs**: Set up a cron job
3. **Monitor feedback sentiment**: Regular review of feedback data
4. **Update reward values**: Based on program performance

### Database Maintenance
```sql
-- Refresh leaderboard (run weekly)
REFRESH MATERIALIZED VIEW tester_leaderboard;

-- Clean up old sessions (run daily)
DELETE FROM beta_testers WHERE status = 'pending' AND applied_at < NOW() - INTERVAL '30 days';

-- Archive completed programs (run monthly)
UPDATE beta_programs SET status = 'completed' WHERE end_date < NOW() AND status = 'active';
```

## Security Considerations

1. **Database Security**:
   - Use connection pooling with SSL
   - Limit database user permissions
   - Regular security updates

2. **API Security**:
   - Rate limiting enabled via Vercel
   - Input validation on all endpoints
   - Authentication required for sensitive operations

3. **User Data**:
   - GDPR compliance for EU users
   - Data retention policies
   - User data export functionality

## Scaling Considerations

### Traffic Growth
- Vercel automatically scales serverless functions
- Database connection pooling prevents connection exhaustion
- CDN caching for static assets

### Feature Scaling
- Add feature flags for A/B testing
- Implement analytics for usage tracking
- Consider microservices for complex features

## Support and Monitoring

### Key Metrics to Monitor
- Beta program completion rates
- User engagement (feedback submissions)
- Points distribution fairness
- API response times
- Database query performance

### Alerts Setup
- Database connection failures
- High API error rates
- Unusual user activity patterns
- Long-running queries

## Rollback Plan

1. Keep previous deployment active
2. Database migrations are additive (safe)
3. Environment variable rollback capability
4. Feature flags for quick disabling

---

**Deployment Status**: ✅ Production Ready
**Last Updated**: Current
**Next Review**: After first 1000 users
