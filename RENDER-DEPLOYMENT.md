# Render Deployment Guide

We have set up a `render.yaml` Blueprint file to automatically deploy your full-stack OpSense application to Render.

## Steps to Deploy

1. **Push your code to GitHub**: 
   Ensure all changes, including the newly created `render.yaml`, are pushed to your GitHub repository.

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Click on **New +** and select **Blueprint**.
   - Connect your GitHub account (if you haven't already) and select your `opSense` repository.
   - Render will automatically detect the `render.yaml` file.

3. **Configure Secrets**:
   During the setup, Render will prompt you to enter the missing environment variables that are marked as `sync: false` in `render.yaml`:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `CORS_ORIGINS`: Provide the URL of your frontend once it's deployed (e.g., `https://opsense-frontend.onrender.com`). *You may need to update this after the first deployment finishes.*
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
   - `CLERK_SECRET_KEY`: Your Clerk secret key.
   
4. **Deploy**:
   Click **Apply** to start deploying. Render will automatically build and start both the FastAPI backend and the Next.js frontend.

## Important Notes
- Render uses the `$PORT` environment variable automatically, and our backend configuration is already set to bind to this port (`--port $PORT`).
- The frontend will automatically be connected to the backend via the `NEXT_PUBLIC_API_URL` environment variable which is dynamically mapped using `RENDER_EXTERNAL_URL`.
- If you run into any WebSocket connection issues, you may need to define `NEXT_PUBLIC_WS_URL` dynamically in the frontend code using the `window.location.host` instead of hardcoding `ws://localhost:8000`.
