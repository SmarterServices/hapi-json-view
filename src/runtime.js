'use strict';

class Runtime {
  constructor(environment) {
    this.content = {};
    this.environment = environment;
  }

  set(/* key, value | value */) {
    const key = arguments.length === 2 ? arguments[0] : null;
    let value = arguments.length === 2 ? arguments[1] : arguments[0];

    if (typeof value === 'function') {
      const runtime = new Runtime(this.environment);
      value(runtime);
      value = runtime.content;
    }

    if (key) {
      this.content[key] = value;
    } else {
      this.content = value;
    }
  }

  array(items, callback) {
    if (!items || !items.length) return [];

    return items.map((item) => {
      const runtime = new Runtime(this.environment);
      callback(runtime, item);

      return runtime.content;
    });
  }

  extract(object, keys) {
    keys.forEach((key) => this.content[key] = object[key]);
  }

  helper(name /* , args */) {
    const args = Array.prototype.slice.call(arguments, 1);
    return this.environment.helpers[name].apply(null, args);
  }

  partial(name, context) {
    const runtime = new Runtime(this.environment);
    return runtime.run(this.environment.partials[name], context);
  }

  run(template, context) {
    const keys = Object.keys(context);
    const values = keys.map((key) => context[key]);

    keys.unshift('json');
    values.unshift(this);

    const executor = new Function(keys.join(', '), `${template}\nreturn json.content;`);
    return executor.apply(null, values);
  }
}

module.exports = Runtime;
