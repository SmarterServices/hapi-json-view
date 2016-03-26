'use strict';

// Load internal modules
const Runtime = require('./runtime');

class Environment {
  constructor() {
    this.helpers = {};
    this.partials = {};
  }

  registerHelper(name, helper) {
    this.helpers[name] = helper;
  }

  registerPartial(name, partial) {
    this.partials[name] = partial;
  }

  compile(template, options, callback) {
    const runtime = new Runtime(this);

    function renderer(context) {
      return JSON.stringify(runtime.run(template, context));
    }

    return renderer;
  }
}

module.exports = Environment;
