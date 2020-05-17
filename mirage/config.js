import Response from 'ember-cli-mirage/response';
import { upload } from 'ember-file-upload/mirage';

const generateValidationError = function(field, title) {
  return {
    status: 422,
    code: 100,
    title,
    source: {
      pointer: `/data/attributes/${field}`,
    },
  };
};

export default function() {
  // Allows us to access the Mirage server in the console using `window.server`.
  window.server = this;

  //this.timing = 400;
  this.namespace = '/api';

  this.resource('deli-items');

  this.resource('events', { except: ['index'] });
  this.get('/events', ({ events }, request) => {
    const range = request.queryParams['filter[range]'];
    let response = events.all();

    if (range) {
      const date = new Date();

      if (range === 'upcoming') {
        date.setHours(0, 0, 0, 0);

        response.models = response.models.filter(event => {
          return new Date(event.startTime) > date;
        });
      } else if (range === 'past') {
        response.models = response.models.filter(event => {
          return new Date(event.startTime) < date;
        });
      }
    }

    // TODO: Sort by `startTime`

    return response;
  });

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

  this.resource('performances');
  this.resource('package-bundles', { except: ['create', 'delete'] });

  this.get('/reviews');

  this.post('/token', (server, request) => {
    let attrs = JSON.parse(request.requestBody);

    if (attrs.email.toLowerCase() === 'admin@email.com' && attrs.password === 'password') {
      return new Response(
        201,
        { 'Content-Type': 'text/plain' },
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsImV4cCI6MjUyNDYwODAwMDAwMH0.izNBdwP_Io0sP_HWl6O5fDB-tP3q53rPlhVf_30l7i8'
      );
    }

    return new Response(401);
  });

  this.post(
    '/upload',
    upload(function(db, request) {
      return new Response(201, { 'Content-Type': 'text/plain' }, request.requestBody.file.url);
    })
  );
}
