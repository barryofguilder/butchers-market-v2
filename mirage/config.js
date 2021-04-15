import Response from 'ember-cli-mirage/response';
import { upload } from 'ember-file-upload/mirage';
import { isAfter, isBefore } from 'date-fns';

const generateValidationError = function (field, title) {
  return {
    status: 422,
    code: 100,
    title,
    source: {
      pointer: `/data/attributes/${field}`,
    },
  };
};

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjI1OTIzMzQ4NDZ9.YBJOag4Kyeq4yBBdAPXYttZMxqX9J_N-L5f5OrWX95w';
// Expired Token
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjE1ODk3NDI4NDZ9.fQj7CW8SnULIzJtL7TyDmmH1nVWWqZqNuv5m0kVwFHw';

// Future Token
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjI1OTIzMzQ4NDZ9.YBJOag4Kyeq4yBBdAPXYttZMxqX9J_N-L5f5OrWX95w';

export default function () {
  // Allows us to access the Mirage server in the console using `window.server`.
  window.server = this;

  this.passthrough('https://images1932-focus-opensocial.googleusercontent.com/**');

  //this.timing = 400;
  this.namespace = '/api';

  this.resource('deli-items');

  this.post('/feedback', (server, request) => {
    let attrs = JSON.parse(request.requestBody).data.attributes;
    let errors = [];

    if (!attrs.name) {
      errors.push(generateValidationError('name', 'Name is required'));
    }

    if (!attrs.email) {
      errors.push(generateValidationError('email', 'Email is required'));
    }

    if (!attrs.message) {
      errors.push(generateValidationError('message', 'Message is required'));
    }

    if (errors.length > 0) {
      return new Response(422, {}, { errors });
    }

    return new Response(204);
  });

  this.resource('hours');

  this.resource('meat-bundles', { only: ['show', 'update'] });
  this.get('/meat-bundles', ({ meatBundles }, request) => {
    const featured = request.queryParams['filter[featured]'];
    const isHidden = request.queryParams['filter[isHidden]'];
    let whereStatement = {};

    if (featured !== undefined) {
      whereStatement.featured = true;
    }

    if (isHidden !== undefined) {
      whereStatement.isHidden = isHidden;
    }

    // TODO: Sort by `displayOrder`
    return meatBundles.where(whereStatement);
  });

  this.resource('menus', { except: ['create', 'delete'] });

  this.resource('package-bundles', { except: ['create', 'delete'] });

  this.get('/reviews');

  this.resource('specials', { except: ['index'] });
  this.get('/specials', ({ specials }, request) => {
    const range = request.queryParams['filter[range]'];
    const isHidden = request.queryParams['filter[isHidden]'];
    let whereStatement = {};

    if (isHidden !== undefined) {
      whereStatement.isHidden = isHidden;
    }

    let response = specials.where(whereStatement);

    if (range !== undefined) {
      if (range === 'active') {
        const now = new Date();

        response.models = response.models.filter((special) => {
          return (
            !special.activeStartDate ||
            (isAfter(now, special.activeStartDate) && isBefore(now, special.activeEndDate))
          );
        });
      }
    }

    return response;
  });

  this.post('/token', (server, request) => {
    let attrs = JSON.parse(request.requestBody).data.attributes;

    if (attrs.username.toLowerCase() === 'admin' && attrs.password === 'password') {
      return new Response(201, { 'Content-Type': 'text/plain' }, TOKEN);
    }

    return new Response(401);
  });

  this.post(
    '/upload',
    upload(function (db, request) {
      return new Response(201, { 'Content-Type': 'text/plain' }, request.requestBody.file.url);
    })
  );

  this.post(
    '/upload/pdf',
    upload(function (db, request) {
      return new Response(201, { 'Content-Type': 'text/plain' }, request.requestBody.file.url);
    })
  );
}
