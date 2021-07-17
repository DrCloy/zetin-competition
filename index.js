const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`express server listening on port ${PORT}`);
});

app.use('/api/data', function (req, res) {
  res.json({ greeting: 'Hello World' });
});

/* React Static Server */
//
app.use('/', express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
