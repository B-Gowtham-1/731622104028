
const express = require('express');
const loggingMiddleware = require('./loggingMiddleware');
const urlStore = require('./urlStore');
const { generateShortcode, isValidShortcode, isValidUrl } = require('./utils');


const app = express();
const PORT = 3000;
const DEFAULT_VALIDITY_MINUTES = 30;

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(loggingMiddleware);


app.post('/shorturis', (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL.' });
  }
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      return res.status(400).json({ error: 'Invalid shortcode. Must be alphanumeric and 4-16 chars.' });
    }
    if (urlStore.exists(code)) {
      return res.status(409).json({ error: 'Shortcode already exists.' });
    }
  } else {
    
    do {
      code = generateShortcode();
    } while (urlStore.exists(code));
  }
  const validMinutes = Number.isInteger(validity) && validity > 0 ? validity : DEFAULT_VALIDITY_MINUTES;
  const expiresAt = Date.now() + validMinutes * 60 * 1000;
  urlStore.set(code, { url, expiresAt });
  res.status(201).json({ shortUrl: `http://localhost:${PORT}/${code}`, expiresAt });
});


app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore.get(shortcode);
  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }
  if (Date.now() > entry.expiresAt) {
    return res.status(410).json({ error: 'Short link expired.' });
  }
  res.redirect(entry.url);
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  
});
