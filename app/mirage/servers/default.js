/* eslint-disable ember/no-get */
import { createServer, Response } from 'miragejs';
import { uploadHandler } from 'ember-file-upload';
import { isAfter, isBefore } from 'date-fns';
import factories from '../factories';
import models from '../models';
import seeds from '../scenarios/default';
import serializers from '../serializers';

export function makeServer(config) {
  const { environment, ...rest } = config || {};
  return createServer({
    environment,
    factories,
    models,
    routes,
    seeds: environment === 'development' ? seeds : undefined,
    serializers,
    ...rest,
  });
}

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjI1OTIzMzQ4NDZ9.YBJOag4Kyeq4yBBdAPXYttZMxqX9J_N-L5f5OrWX95w';
// Expired Token
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjE1ODk3NDI4NDZ9.fQj7CW8SnULIzJtL7TyDmmH1nVWWqZqNuv5m0kVwFHw';

// Future Token
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTg5NzQyODQ2LCJleHAiOjI1OTIzMzQ4NDZ9.YBJOag4Kyeq4yBBdAPXYttZMxqX9J_N-L5f5OrWX95w';

function routes() {
  // Allows us to access the Mirage server in the console using `window.server`.
  window.server = this;

  //this.timing = 400;
  this.namespace = '/api';

  this.resource('deli-items');
  this.get('/deli-items', ({ deliItems }, request) => {
    const isHidden = request.queryParams['filter[isHidden]'];

    if (isHidden !== undefined) {
      return deliItems.where({ isHidden });
    }

    return deliItems.all();
  });

  this.resource('feature-flags');
  this.resource('grab-and-go');
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

  this.post('/specials/reorder', () => {
    return new Response(201);
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
    uploadHandler(function () {
      return new Response(201, { 'Content-Type': 'text/plain' }, {});
    }),
  );
}
