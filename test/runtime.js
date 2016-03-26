'use strict';

// Load external modules
const Lab = require('lab');

// Load internal modules
const Environment = require('../src/environment');
const Runtime = require('../src/runtime');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Lab.assertions.expect;

lab.describe('set()', () => {
  lab.it('sets the value if key is not provided', (done) => {
    const json = new Runtime();
    json.set('example');

    expect(json.content).to.equal('example');
    done();
  });

  lab.it('executes and sets the value if key is not provided and value is a function', (done) => {
    const json = new Runtime();
    json.set((json) => {
      json.set('example');
    });

    expect(json.content).to.equal('example');
    done();
  });

  lab.it('sets the value if key is provided', (done) => {
    const json = new Runtime();
    json.set('test', 'example');

    expect(json.content).to.deep.equal({ test: 'example' });
    done();
  });

  lab.it('executes and sets the value if key is provided and value is a function', (done) => {
    const json = new Runtime();
    json.set('test', (json) => {
      json.set('example');
    });

    expect(json.content).to.deep.equal({ test: 'example' });
    done();
  });
});

lab.describe('array()', () => {
  lab.it('creates an array with a primitive', (done) => {
    const json = new Runtime();
    json.set('test', json.array(['one', 'two'], (json, item) => {
      json.set(item);
    }));

    expect(json.content).to.deep.equal({ test: ['one', 'two'] });
    done();
  });

  lab.it('creates an array with an object', (done) => {
    const json = new Runtime();
    json.set('test', json.array(['one', 'two'], (json, item) => {
      json.set('item', item);
    }));

    expect(json.content).to.deep.equal({ test: [{ item: 'one' }, { item: 'two' }] });
    done();
  });

  lab.it('creates an array with a falsy value', (done) => {
    const json = new Runtime();
    json.set(json.array(null));

    expect(json.content).to.deep.equal([]);
    done();
  });

  lab.it('creates an array without a key', (done) => {
    const json = new Runtime();
    json.set(json.array(['one', 'two'], (json, item) => {
      json.set(item);
    }));

    expect(json.content).to.deep.equal(['one', 'two']);
    done();
  });
});

lab.describe('extract()', () => {
  lab.it('extracts values', (done) => {
    const json = new Runtime();
    const object = { one: 'one', two: 'two', three: 'three', four: 'four' };
    json.extract(object, ['two', 'three']);

    expect(json.content).to.deep.equal({ two: 'two', three: 'three' });
    done();
  });
});

lab.describe('helper()', () => {
  lab.it('calls the helper function', (done) => {
    const helper = function(text) {
      return text.toUpperCase();
    };

    const environment = new Environment();
    environment.registerHelper('uppercase', helper);

    const json = new Runtime(environment);
    json.set('test', json.helper('uppercase', 'example'));

    expect(json.content).to.deep.equal({ test: 'EXAMPLE' });
    done();
  });
});

lab.describe('partial()', () => {
  lab.it('renders the partial', (done) => {
    const partial = 'json.set(\'name\', author.name)';

    const environment = new Environment();
    environment.registerPartial('author', partial);

    const json = new Runtime(environment);
    json.set('author', json.partial('author', { author: { name: 'example' } }));

    expect(json.content).to.deep.equal({ author: { name: 'example' } });
    done();
  });
});

lab.describe('run()', () => {
  lab.it('runs the runtime', (done) => {
    const runtime = new Runtime();
    const result = runtime.run('json.set(\'name\', author.name)', { author: { name: 'example' } });

    expect(result).to.deep.equal({ name: 'example' });
    done();
  });
});
