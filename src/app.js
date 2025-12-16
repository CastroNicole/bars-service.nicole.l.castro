const express = require('express');
const barsRoutes = require('./routes/bars.routes');

const app = express();
app.use(express.json());

app.use('/bars', barsRoutes);

app.get('/ping', (req, res) => res.send('pong'));

module.exports = app;
