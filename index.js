const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const app = express();

/* Constants */
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const MONGODB_URL =
  `mongodb://${process.env.MONGODB_HOST || localhost}:${
    process.env.MONDODB_PORT || 27017
  }/` + (process.env.MONGODB_NAME || 'zetin-competition');

/* Connect to mongodb server */
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log(`successfully connected to ${MONGODB_URL}`);
  })
  .catch((e) => {
    console.error(e);
  });

/* Middlewares */
app.use(express.json());
app.use(cookieParser());

/* API server routes */
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/participants', require('./routes/api/participants'));
app.use('/api/competitions', require('./routes/api/competitions'));
app.use('/api/files', require('./routes/api/files'));
app.get(['/api', '/api/*'], (req, res) => {
  res.status(400).send('Invalid access');
});

/* Static server for react */
app.use('/', express.static(path.join(__dirname, 'client/build')));

/* The other paths are routed to index.html built by react */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

/* Error handling */
app.use(function (err, req, res, next) {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode).send(err.message);
  } else {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* Start server */
app.listen(PORT, () => {
  console.log(`express server listening on port ${PORT}`);
});
