require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const routers = require('./routers');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

// ─── API ───────────────────────────────────────────────────────────────────
app.use('/api', routers);

// ─── Frontend (local only, not on Vercel) ────────────────────────────────
if (!process.env.VERCEL) {
  const angularDist = path.join(__dirname, 'public');
  app.use(express.static(angularDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(angularDist, 'index.html'));
  });
}

// Export app for Vercel serverless; listen only when running directly
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`  App:  http://localhost:${PORT}`);
    console.log(`  API:  http://localhost:${PORT}/api`);
  });
}

module.exports = app;
