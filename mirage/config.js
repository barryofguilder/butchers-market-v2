import Response from 'ember-cli-mirage/response';
import { upload } from 'ember-file-upload/mirage';

export default function() {
  // Allows us to access the Mirage server in the console using `window.server`.
  window.server = this;

  //this.timing = 400;
  this.namespace = '/api';

  this.post(
    '/upload',
    upload(function(db, request) {
      return new Response(201, { 'Content-Type': 'text/plain' }, request.requestBody.file.url);
    })
  );

  this.resource('events');
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

  this.resource('deli-items');

  //
  // Admin CRUD
  //
  this.namespace = '/server';

  this.post('/feedback.php', (server, request) => {
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
      return new Response(400, {}, { errors });
    }

    return new Response(201, {}, {});
  });

  this.get('/hours.php', 'hour', { coalesce: true });
  this.post('/hours.php', 'hour');
  this.put('/hours.php', function({ hours }, request) {
    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs('hour');

    return hours.find(id).update(attrs);
  });
  this.del('/hours.php', function({ hours }, request) {
    let id = request.queryParams.id;

    hours.find(id).destroy();
  });

  this.get('/performances.php', 'performance', { coalesce: true });
  this.post('/performances.php', 'performance');
  this.put('/performances.php', function({ performances }, request) {
    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs('performance');

    return performances.find(id).update(attrs);
  });
  this.del('/performances.php', function({ performances }, request) {
    let id = request.queryParams.id;

    performances.find(id).destroy();
  });

  this.get('/packageBundles.php', 'package-bundle', { coalesce: true });
  this.post('/packageBundles.php', 'package-bundle');
  this.put('/packageBundles.php', function({ packageBundles }, request) {
    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs('package-bundle');

    return packageBundles.find(id).update(attrs);
  });
  this.del('/packageBundles.php', function({ packageBundles }, request) {
    let id = request.queryParams.id;

    packageBundles.find(id).destroy();
  });
}
