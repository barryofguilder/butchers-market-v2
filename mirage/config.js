import Response from 'ember-cli-mirage/response';
import { upload } from 'ember-file-upload/mirage';

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
    let attrs = JSON.parse(request.requestBody);
    let errors = [];

    if (!attrs.name) {
      errors.push({ detail: { name: 'empty' } });
    }

    if (!attrs.email) {
      errors.push({ detail: { email: 'empty' } });
    }

    if (!attrs.message) {
      errors.push({ detail: { message: 'empty' } });
    }

    if (errors.length > 0) {
      return new Response(422, {}, { errors });
    }

    return new Response(201, {}, {});
  });

  this.resource('hours');

  this.get('/meat-bundles', { except: ['index'] });
  this.get('/meat-bundles', ({ meatBundles }, request) => {
    const featured = request.queryParams['filter[featured]'];
    let response;

    if (featured === undefined) {
      response = meatBundles.all();
    } else {
      response = meatBundles.where({ featured: true });
    }

    // TODO: Sort by `displayOrder`

    return response;
  });

  this.resource('performances');
  this.resource('package-bundles', { except: ['create', 'delete'] });

  this.get('/reviews');

  this.post(
    '/upload',
    upload(function(db, request) {
      return new Response(201, { 'Content-Type': 'text/plain' }, request.requestBody.file.url);
    })
  );
}
