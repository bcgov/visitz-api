const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello world! This is the visitz-api.' });
});

app.get('/caseload', (req, res) => {
  res.json({message: 'This is the caseload API endpoint.'});
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
