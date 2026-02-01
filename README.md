# Healthy Ideas Platform - Next.js Full Stack

Rebuilt from React/Vite to Next.js + MongoDB

## Features
- User Authentication (JWT)
- Ideas CRUD with Categories (Workout, Lifestyle, Food, Mindful)
- Comments with Pagination
- Likes System
- User Profiles
- Responsive Design with Tailwind CSS

## Tech Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- MongoDB + Mongoose
- Tailwind CSS
- JWT Authentication

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/healthy-ideas-nextjs.git
cd healthy-ideas-nextjs
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/logout` - Logout

### Ideas
- `GET /api/ideas` - List ideas (with optional category filter)
- `POST /api/ideas` - Create idea (auth required)
- `GET /api/ideas/:id` - Get single idea
- `PATCH /api/ideas/:id` - Update idea (owner only)
- `DELETE /api/ideas/:id` - Delete idea (owner only)

### Comments
- `GET /api/comments?ideaId=xxx` - List comments for idea
- `POST /api/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (owner only)

### Likes
- `GET /api/likes?ideaId=xxx` - List likes for idea
- `POST /api/likes` - Like an idea (auth required)

### Profiles
- `GET /api/profiles?_ownerId=xxx` - Get user profile
- `POST /api/profiles` - Create profile (auth required)
