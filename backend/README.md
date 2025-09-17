# Itonzi Server

A Node.js backend server for the Itonzi application.

## Features

- User statistics tracking
- MongoDB integration
- Automatic user count recording
- RESTful API endpoints

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your environment variables:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

## Deployment to Render

### Method 1: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `itonzi-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

### Method 2: Using render.yaml (Recommended)

1. Push your code to GitHub (including the `render.yaml` file)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure the service
6. Add your `MONGO_URI` environment variable in the dashboard

## Environment Variables

- `MONGO_URI`: MongoDB connection string (required)
- `PORT`: Server port (Render sets this automatically)
- `NODE_ENV`: Environment (set to 'production' for deployment)

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/user/stats` - Get user statistics
- `POST /api/user/stats` - Create user statistics

## Health Check

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Notes

- The server automatically records user count history every 5 minutes
- CORS is configured for `https://itrustonzikrulislam.vercel.app`
- MongoDB connection is established on server startup 