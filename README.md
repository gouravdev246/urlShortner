# Briefly

A basic MERN URL shortener built with JavaScript.

## Run locally

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `server/.env` and set `MONGO_URI`.
3. Install dependencies:

```bash
npm install
npm run install:all
```

4. Start the client and API together:

```bash
npm run dev
```

Open `http://localhost:5173`.

The API exposes `POST /api/links`, `GET /api/links`, and `GET /:shortCode` for redirects.

## Deploy to Vercel

Deploy `client` and `server` as two separate Vercel projects, setting each project's **Root Directory** to its folder.

For the **server** project, add these environment variables:

```text
MONGO_URI=your MongoDB Atlas connection string
CLIENT_URL=https://your-client.vercel.app
```

For the **client** project, add:

```text
VITE_API_URL=https://your-server.vercel.app
```

`VITE_API_URL` is embedded into the client during the Vercel build. After adding or changing it in Vercel, redeploy the client; refreshing the existing deployment is not enough.

Deploy the server first so its URL can be used as `VITE_API_URL` in the client project. MongoDB Atlas must allow connections from Vercel by configuring its network access rules.