# Discoverly 🚀

A modern product discovery and launch platform designed to help makers, founders, and early-stage startups launch their products and get discovered by the right audience.

## Features

### Core Features (MVP)
- ✅ **Product Launch Pages** - Create beautiful product pages with screenshots, videos, and descriptions
- ✅ **Smart Discovery Feed** - Personalized feed ranked by relevance and engagement
- ✅ **Category Pages** - SEO-friendly pages organized by product categories
- ✅ **Comments & Discussions** - Threaded conversations with makers
- ✅ **Bookmark/Save** - Save products for later
- ✅ **Analytics Dashboard** - Views, clicks, bookmarks, and geographic insights for makers
- ✅ **Newsletter** - Weekly curated digest of top products
- ✅ **Search & Filters** - Search by tags, categories, and trending filters
- ✅ **User Authentication** - Secure auth powered by Stack Auth (Neon Auth)

### User Personas Supported
- **Makers/Founders** - Launch products, gain visibility, track analytics
- **Early Adopters** - Discover relevant products, provide feedback
- **Investors/Analysts** - Identify trends and promising startups
- **Micro-influencers** - Find products to review and share

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Analytics charts

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Neon Database** - Serverless PostgreSQL
- **Stack Auth** - Authentication (Neon Auth integration)

### Design
- **Minimalist UI** - Clean, modern interface
- **Cyan Theme** - Primary color: cyan (#06b6d4)
- **Responsive** - Mobile-first design

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Stack Auth credentials (https://app.stack-auth.com)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd discoverly
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

The `.env.local` file has been created with the database URL. You need to add your Stack Auth credentials:

1. Go to https://app.stack-auth.com
2. Create a new project (free)
3. Go to Settings → API Keys
4. Copy the three keys and update `.env.local`:

```env
# Database is already configured
DATABASE_URL=postgresql://neondb_owner:npg_LR5elZa7sDrw@ep-muddy-queen-a4veteyb-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Add your Stack Auth credentials here
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_client_key
STACK_SECRET_SERVER_KEY=your_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The database has been set up with demo data including 30 users and 30 products across all categories.

## Project Structure

```
discoverly/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── products/            # Product CRUD
│   │   ├── dashboard/           # Dashboard data
│   │   ├── newsletter/          # Newsletter subscriptions
│   │   ├── search/              # Search functionality
│   │   └── user/                # User profile
│   ├── dashboard/               # Maker dashboard
│   ├── discover/                # Discovery feed
│   ├── launch/                  # Product launch form
│   ├── product/[id]/            # Product detail pages
│   ├── search/                  # Search page
│   ├── newsletter/              # Newsletter signup
│   ├── onboarding/              # User onboarding
│   ├── categories/              # Category pages
│   ├── handler/[...stack]/      # Auth handlers
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── ProductCard.tsx          # Product card component
│   └── CategoryCard.tsx         # Category card component
├── lib/                         # Utilities
│   └── db.ts                    # Database client & types
├── database/                    # Database files
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Seed data
├── stack.ts                     # Stack Auth configuration
└── package.json                 # Dependencies
```

## Database Schema

### Main Tables
- **users** - User profiles (synced with Stack Auth)
- **products** - Product launches
- **comments** - Product discussions
- **bookmarks** - Saved products
- **product_views** - Analytics tracking
- **product_clicks** - Click tracking
- **newsletter_subscriptions** - Newsletter subscribers
- **beta_testers** - Beta testing signups
- **follows** - User follows

See `database/schema.sql` for complete schema.

## Key Features Implementation

### 1. Product Launch Flow
1. User signs up/logs in via Stack Auth
2. Completes onboarding (username, role, interests)
3. Creates product launch page with details
4. Schedules or publishes immediately
5. Tracks engagement via analytics dashboard

### 2. Discovery Feed
- Personalized based on user interests
- Filters: trending, recent, featured, by category
- Relevance-based ranking algorithm

### 3. Analytics Dashboard
- Real-time views, clicks, bookmarks, comments
- Geographic distribution
- 30-day trend charts
- Export capabilities (future)

### 4. Engagement Features
- Comments with threading support
- Bookmark/save functionality
- Direct maker contact
- Social sharing (future)

## API Routes

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Comments
- `GET /api/products/[id]/comments` - Get comments
- `POST /api/products/[id]/comments` - Add comment

### Bookmarks
- `GET /api/products/[id]/bookmark` - Check bookmark status
- `POST /api/products/[id]/bookmark` - Toggle bookmark

### Analytics
- `GET /api/products/[id]/analytics` - Get product analytics

### Dashboard
- `GET /api/dashboard/products` - Get user's products

### Search
- `GET /api/search?q=query` - Search products

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### User
- `POST /api/user/profile` - Update user profile

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Roadmap

### Phase 1 (Current - MVP)
- [x] Core product launch functionality
- [x] Discovery feed
- [x] Analytics dashboard
- [x] Authentication
- [x] Comments & bookmarks

### Phase 2 (Post-MVP)
- [ ] Beta testing community
- [ ] Advanced search with AI
- [ ] Email notifications
- [ ] Social sharing
- [ ] User profiles with portfolios

### Phase 3 (Monetization)
- [ ] Sponsored launches
- [ ] Premium analytics
- [ ] Featured placements
- [ ] API access for third parties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Neon, and Stack Auth

