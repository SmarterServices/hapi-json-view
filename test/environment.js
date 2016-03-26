'use strict';

// Load external modules
const Hapi = require('hapi');
const Lab = require('lab');
const Path = require('path');
const Vision = require('vision');

// Load internal modules
const Environment = require('../src/environment');
const HapiJsonView = require('../src/index.js');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Lab.assertions.expect;

lab.describe('registerHelper()', () => {
  lab.it('register the helper', (done) => {
    const environment = new Environment();
    environment.registerHelper('uppercase', () => { });

    expect(environment.helpers).to.include('uppercase');
    done();
  });
});

lab.describe('registerPartial()', () => {
  lab.it('registers the partial', (done) => {
    const environment = new Environment();
    environment.registerPartial('author', 'json.set(\'name\', author.name);');

    expect(environment.partials).to.include('author');
    done();
  });
});

lab.describe('compile()', () => {
  lab.it('renders a template', (done) => {
    const server = new Hapi.Server();
    server.connection();

    server.register(Vision, (err) => {
      if (err) {
        return done(err);
      }

      server.views({
        engines: {
          tmpl: {
            module: HapiJsonView.create(),
            contentType: 'application/json',
          },
        },
        path: Path.join(__dirname, 'templates'),
        helpersPath: Path.join(__dirname, 'templates/helpers'),
        partialsPath: Path.join(__dirname, 'templates/partials'),
      });

      server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
          const article = { title: 'example' };
          const author = { name: 'example' };

          reply.view('article.tmpl', { article: article, author: author });
        },
      });

      server.inject('/', (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('{"title":"EXAMPLE","author":{"name":"example"}}');
        done();
      });
    });
  });
});
