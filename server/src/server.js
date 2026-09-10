import crypto from 'node:crypto';
import cors from 'cors';
import express from 'express';
import Link from './models/Link.js';
import connectDB from './db/dbConfig.js';

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: clientUrl }));
app.use(express.json());
app.use(async (_request, response, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    response.status(503).json({ message: 'Database connection unavailable.' });
  }
});

const createShortCode = () => crypto.randomBytes(4).toString('base64url');

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/links', async (_request, response) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).limit(8).lean();
    response.json(links);
  } catch (error) {
    response.status(500).json({ message: 'Unable to load links.' });
  }
});

app.post('/api/links', async (request, response) => {
  const { originalUrl } = request.body;

  try {
    const parsedUrl = new URL(originalUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }

    let shortCode = createShortCode();
    while (await Link.exists({ shortCode })) {
      shortCode = createShortCode();
    }

    const link = await Link.create({ originalUrl: parsedUrl.toString(), shortCode });
    response.status(201).json(link);
  } catch (error) {
    const message = error instanceof TypeError || error.message === 'Unsupported protocol'
      ? 'Enter a valid http or https URL.'
      : 'Unable to create your short link.';
    response.status(400).json({ message });
  }
});

app.get('/:shortCode', async (request, response) => {
  try {
    const link = await Link.findOneAndUpdate(
      { shortCode: request.params.shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return response.status(404).send('Short link not found.');
    }

    return response.redirect(link.originalUrl);
  } catch (error) {
    return response.status(500).send('Unable to redirect.');
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;