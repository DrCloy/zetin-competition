const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

/* Constants */
const PORT = process.env.PORT || 8000;
const DB_NAME = process.env.DB_NAME || 'zetin-competition';
const MONGO_URI =
  (process.env.MONGO_URI || 'mongodb://localhost:27017/') + DB_NAME;

/* Connect to mongodb server */
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`successfully connected to ${MONGO_URI}`);
  })
  .catch((e) => {
    console.error(e);
  });

/* Middlewares */
app.use(express.json());

/* API server routes */
app.use('/api/competitions', require('./routes/api/competitions'));
app.get(['/api', '/api/*'], (req, res) => {
  res.status(400).send('Invalid access');
});

/* Static server for react */
app.use('/', express.static(path.join(__dirname, 'client/build')));

/* The other paths are routed to index.html built by react */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

/* Start server */
app.listen(PORT, () => {
  console.log(`express server listening on port ${PORT}`);
});
