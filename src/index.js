'use strict';

// Load internal modules
const Environment = require('./environment');

exports.create = function() {
  return new Environment();
};
