# Deployment Guide

## Environment Variables

Create a `.env.local` file in the root directory with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Set up database access with username/password
5. Set up network access (allow all IPs: 0.0.0.0/0)
6. Get your connection string and replace placeholders

## Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable: `MONGODB_URI`
5. Deploy!

## Local Development

```bash
npm run dev
```

Visit http://localhost:3000 