const express = require('express');

const deserializer = require('./src/serialization/deserializer.js');
const pageRenderer = require('./src/page-renderer/page-renderer.js');

const app = express();

app.get('/course', (req, res) => {
  const { data: courseBlob, debug: debugParam } = req.query;
  const debug = debugParam === 'true' || false;
  const course = deserializer(JSON.parse(Buffer.from(courseBlob, 'base64').toString())).obstacles;
  res.send(pageRenderer(course, debug));
});

app.use((req, res, next) => res.status(404).send("Sorry can't find that!"));

const port = 3000;
app.listen(port, () => {
  console.log(`Express listening on ${port}`);
  console.log('============================');
});
