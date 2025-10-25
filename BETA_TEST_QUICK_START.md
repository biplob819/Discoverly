# Beta Test Feature - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migration

Connect to your PostgreSQL/Neon database and run the migration:

```bash
psql -h your-host -U your-user -d your-database -f database/migrations/beta_testing_feature.sql
```

Or copy and paste the contents of `database/migrations/beta_testing_feature.sql` into your database client.

### Step 2: Test the Feature

#### As a User (Tester):
1. Visit `/beta-test` in your browser
2. Browse available beta programs
3. Click "Join Beta" on any program
4. Fill out your profile (skillset, device, experience)
5. Start testing and submit feedback at `/beta/[program-id]`

#### As a Builder:
1. Make sure your user role is set to 'builder' in the database:
   ```sql
   UPDATE users SET role = 'builder' WHERE email = 'your-email@example.com';
   ```
2. Create a product first (if you haven't already)
3. Visit `/launch` or use the API to create a beta program:
   ```bash
   POST /api/beta/programs
   ```
4. View analytics at `/dashboard/beta/[program-id]`

### Step 3: Customize (Optional)

#### Add More Reward Types
Edit `lib/constants.ts` and add to `REWARD_TYPES`:
```typescript
{ id: 'your-reward', name: 'Your Reward', icon: '🎁' }
```

#### Add More Feedback Categories
Edit `lib/constants.ts` and add to `FEEDBACK_CATEGORIES`:
```typescript
'Your Category'
```

#### Customize Points
Edit `lib/constants.ts` under `POINTS_REWARDS`:
```typescript
export const POINTS_REWARDS = {
  JOINED_BETA: 10,
  SUBMITTED_FEEDBACK: 20,
  CRITICAL_BUG: 50,
  FEATURE_VOTE: 5,
  COMPLETED_BETA: 100,
  DAILY_ACTIVE: 5
} as const;
```

---

## 📋 Navigation Changes

The **"Categories"** link in the top navigation has been **replaced** with **"Beta Test"** (styled in purple to stand out).

---

## 🎯 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Beta Test Listing | `/beta-test` | Browse all active beta programs |
| Beta Program Details | `/beta/[id]` | View program, join, submit feedback, vote on features |
| Builder Dashboard | `/dashboard/beta/[id]` | Analytics, manage testers, respond to feedback |
| Leaderboard | Use API: `/api/beta/leaderboard` | Top testers by points |

---

## 🔑 API Examples

### Create a Beta Program (Builder Only)
```bash
POST /api/beta/programs
Content-Type: application/json

{
  "product_id": "your-product-uuid",
  "title": "Early Access Beta Test",
  "description": "Help us test our new AI-powered features",
  "test_url": "https://beta.yourapp.com",
  "access_type": "open",
  "test_credentials": {
    "username": "beta",
    "password": "test123"
  },
  "test_instructions": "Focus on the new dashboard and AI chat features",
  "feedback_categories": ["UX", "Functionality", "AI Accuracy", "Performance"],
  "reward_type": "lifetime_deal",
  "reward_value": {
    "description": "50% lifetime discount",
    "code": "BETA50"
  },
  "max_testers": 50,
  "end_date": "2025-12-31"
}
```

### Join a Beta Test (Authenticated User)
```bash
POST /api/beta/join
Content-Type: application/json

{
  "beta_program_id": "program-uuid",
  "product_id": "product-uuid",
  "skillset": ["UX/UI Design", "QA Testing"],
  "device_type": "Desktop (Mac)",
  "experience_level": "intermediate"
}
```

### Submit Feedback
```bash
POST /api/beta/feedback
Content-Type: application/json

{
  "beta_program_id": "program-uuid",
  "product_id": "product-uuid",
  "category": "UX",
  "rating": 5,
  "title": "Dashboard layout is confusing",
  "content": "The new dashboard has too many buttons...",
  "is_critical": false
}
```

### Vote on Feature
```bash
POST /api/beta/features/[feature-id]/vote
Content-Type: application/json

{
  "vote_type": "upvote"
}
```

---

## 🎨 UI Theme

The Beta Test feature uses a **purple and pink gradient theme** to distinguish it from regular product listings:

- **Primary Colors**: Purple (#9333ea), Pink (#ec4899)
- **Gradients**: `from-purple-600 via-pink-600 to-purple-700`
- **Accent Colors**: 
  - Yellow/Orange for rewards
  - Red for critical issues
  - Green for completed/resolved items
  - Blue for active states

---

## 🏆 Gamification Overview

### Points System
- **Join Beta**: 10 points
- **Submit Feedback**: 20 points
- **Report Critical Bug**: 50 points (bonus!)
- **Vote on Feature**: 5 points
- **Complete Beta**: 100 points

### Leaderboard
Access via API: `GET /api/beta/leaderboard`

Shows:
- Total points
- Beta tests joined
- Feedback submitted
- Completed tests

---

## ⚠️ Important Notes

1. **User Roles**: Only users with role `'builder'` can create beta programs
2. **Authentication Required**: Most features require user authentication via Stack Auth
3. **Materialized View**: For best performance, set up a cron job to refresh the leaderboard view periodically
4. **Credentials Security**: Test credentials are visible to approved testers only

---

## 🐛 Common Issues

### "Unauthorized" Error
- Ensure user is authenticated
- Check user role is set correctly
- Verify ownership of resources

### Points Not Updating
- Check database triggers are active
- Verify `tester_points` table has entries

### Leaderboard Not Showing Data
- Run: `REFRESH MATERIALIZED VIEW CONCURRENTLY tester_leaderboard;`
- Check users have submitted feedback/earned points

---

## 📞 Support

For detailed documentation, see `BETA_TEST_FEATURE.md`

For questions or issues:
1. Check database logs
2. Verify API responses
3. Check browser console for errors
4. Ensure all migrations ran successfully

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Database migration completed successfully
- [ ] Navigation shows "Beta Test" link
- [ ] Can create a beta program (as builder)
- [ ] Can join a beta test (as user)
- [ ] Can submit feedback
- [ ] Points are awarded
- [ ] Builder dashboard loads
- [ ] Feature voting works
- [ ] No TypeScript/linter errors

---

## 🎉 You're Ready!

Your Beta Test platform is fully functional. Start creating beta programs and building a community of engaged testers!

**Pro Tips:**
1. Offer valuable rewards to attract quality testers
2. Respond quickly to critical issues
3. Keep testers engaged with updates
4. Recognize top contributors
5. Use feedback to iterate quickly

Happy testing! 🚀

