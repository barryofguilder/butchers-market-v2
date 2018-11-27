import Response from 'ember-cli-mirage/response';

export default function() {

  //this.timing = 400;
  this.namespace = '/data';

  this.get('/deliItems.json', 'deli-item');
  this.get('/events.json', 'event');
  this.get('/hours.json', 'hour');
  this.get('/meatBundles.json', 'meat-bundle');
  this.get('/meatProducts.json', 'meat-product');
  this.get('/performances.json', 'performance');
  this.get('/reviews.json', 'review');

  //
  // Admin CRUD
  //
  this.namespace = '/server';

  this.get('/events.php', 'event', { coalesce: true });
  this.post('/events.php', 'event');
  this.put('/events.php', function ({ events }, request) {
    // This is a temporary workaround, see this GitHub issue:
    // https://github.com/samselikoff/ember-cli-mirage/issues/1384
    this.path = '/events';

    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs();

    return events.find(id).update(attrs);
  });
  this.del('/events.php', function ({ events }, request) {
    let id = request.queryParams.id;

    events.find(id).destroy();
  });

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
  this.put('/hours.php', function ({ hours }, request) {
    // This is a temporary workaround, see this GitHub issue:
    // https://github.com/samselikoff/ember-cli-mirage/issues/1384
    this.path = '/hours';

    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs();

    return hours.find(id).update(attrs);
  });

  this.get('/performances.php', 'performance', { coalesce: true });
  this.post('/performances.php', 'performance');
  this.put('/performances.php', function ({ performances }, request) {
    // This is a temporary workaround, see this GitHub issue:
    // https://github.com/samselikoff/ember-cli-mirage/issues/1384
    this.path = '/performances';

    let id = request.queryParams.id;
    let attrs = this.normalizedRequestAttrs();

    return performances.find(id).update(attrs);
  });
  this.del('/performances.php', function ({ performances }, request) {
    let id = request.queryParams.id;

    performances.find(id).destroy();
  });
}
