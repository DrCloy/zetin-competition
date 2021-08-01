const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

/* Constants */
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const DB_NAME = process.env.DB_NAME || 'zetin-competition';
const MONGO_URI =
  (process.env.MONGO_URI || 'mongodb://localhost:27017/') + DB_NAME;

/* Connect to mongodb server */
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
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
app.use('/api/rules', require('./routes/api/rules'));
app.use('/api/files', require('./routes/api/files'));
app.get(['/api', '/api/*'], (req, res) => {
  res.status(400).send('Invalid access');
});

/* File server routes */
app.use('/files/posters', require('./routes/files/poster'));

/* Static server for react */
app.use('/', express.static(path.join(__dirname, 'client/build')));

/* The other paths are routed to index.html built by react */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

/* Error handling */
app.use(function (err, req, res, next) {
  if (err) {
    // console.error(err);
    res.status(err.statusCode).send(err.message);
  }
});

/* Start server */
app.listen(PORT, () => {
  console.log(`express server listening on port ${PORT}`);
});
