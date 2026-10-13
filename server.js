const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB || 'greenplate';
const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
let stateCollection = null;
let mongoError = null;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: stateCollection ? 'connected' : 'disconnected', ...(mongoError ? { databaseMessage: mongoError } : {}) });
});

app.get('/api/state', async (_req, res) => {
  if (!stateCollection) return res.status(503).json({ error: 'MongoDB is not connected. Start MongoDB and restart the backend.' });
  try {
    const record = await stateCollection.findOne({ _id: 'default-app-state' });
    res.json({ state: record?.state || null });
  } catch (error) {
    res.status(500).json({ error: 'Could not read app state from MongoDB.' });
  }
});

app.put('/api/state', async (req, res) => {
  if (!stateCollection) return res.status(503).json({ error: 'MongoDB is not connected. Start MongoDB and restart the backend.' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected the Greenplate state as a JSON object.' });
  }
  try {
    await stateCollection.updateOne(
      { _id: 'default-app-state' },
      { $set: { state: req.body, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Could not save app state to MongoDB.' });
  }
});

async function start() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    stateCollection = db.collection('app_state');
    mongoError = null;
    console.log(`MongoDB connected: ${DB_NAME}.app_state`);
  } catch (error) {
    mongoError = 'Connection failed. Check MongoDB is running and MONGODB_URI is correct.';
    console.error('MongoDB connection failed:', error.message);
    console.error('The frontend will still load, but API persistence needs MongoDB.');
  }
  app.listen(PORT, () => console.log(`Greenplate running at http://localhost:${PORT}`));
}

start();
