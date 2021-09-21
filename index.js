'use strict';

var express = require('express');
var app = express();
require('dotenv').config();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

const port = 3000;

module.exports = (cb) => {
  const callbackUrl = 'http://localhost:3000/auth';

  app.listen(port, (err) => {
    if (err) return console.error(err);

    console.log(`Express server listening at http://localhost:${port}`);
    if (process.send) {
        process.send('online');
    }

    return cb({
      app,
      callbackUrl,
    });
  });
};