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