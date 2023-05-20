const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const app = express();
const port = 4200;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(cors({
  exposedHeaders: ['X-Referer']
}));

app.use((req, res, next) => {
  const originUrl = req.headers.origin;

  if (allowedOrigins.includes(originUrl)) {
    res.setHeader('Access-Control-Allow-Origin', originUrl);
  }

  if (!originUrl) {
    res.status(404).send(); // not actually accurate, but we're going for obfuscation here
  }

  next();
});

app.use((req, res, next) => {
  if (
    process.env.ENVIRONMENT !== "LOCAL" 
    && (
      !req.headers['x-referer'] || req.headers['x-referer'] !== 'cloudfront'
    )
  ) {
    res.status(404).send(); // not actually accurate, but we're going for obfuscation here
  }

  next();
});

app.get('/environment-variables', (req, res) => {
  res.json({
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});