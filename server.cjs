const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.cjs');

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: 'minimal'
}));

app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

const port = process.env.PORT || 5173;
app.listen(port, () => {
  console.log(`Dev server running: http://localhost:${port}`);
});


