#!/usr/bin/env node

require('streamline').register({
  cache: true,
  fibers: true,
  verbose: true,
});

var server = require('simple-express-server');
var app = require('./index');
server(app);
