# Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** - Free tier available at https://www.mongodb.com/cloud/atlas
2. **Vercel Account** - Free at https://vercel.com
3. **GitHub Account** - For version control

## Setup Instructions

### 1. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (save username and password)
4. Get your connection string:
   - Click "Connect"
   - Choose "Drivers"
   - Copy the MongoDB URI
   - Replace `<username>` and `<password>` with your credentials
   - Replace `myFirstDatabase` with `prompts-db`

Example: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/prompts-db?retryWrites=true&w=majority`

### 2. Local Development

1. Clone/navigate to the project:
```bash
cd path/to/4Prompt
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your MongoDB URI:
```
MONGODB_URI=your_mongodb_connection_string
VITE_API_URL=http://localhost:3001/api
```

5. Start the frontend dev server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Push to GitHub first:
```bash
git add .
git commit -m "initial: Create prompts manager app"
git push origin main
```

3. Deploy:
```bash
vercel
```

#### Option B: Using Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
6. Click "Deploy"

### 4. Post-Deployment

1. Update frontend API URL in `vercel.json` if needed
2. Test all CRUD operations on the live site
3. Share your site URL!

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB Atlas firewall settings (allow 0.0.0.0/0 for development)
- Verify connection string is correct
- Check if cluster is running

### API Not Responding
- Check Vercel function logs
- Verify `MONGODB_URI` environment variable is set
- Check browser network tab for actual request/response

### Frontend Build Errors
- Clear `node_modules` and reinstall: `npm run install-all`
- Check Node.js version (14+ required)
