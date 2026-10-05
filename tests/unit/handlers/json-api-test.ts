import { module, test } from 'qunit';
import type { RequestContext } from '@warp-drive/core/types/request';
import { JsonApiHandler } from 'butchers-market/handlers/json-api';

interface SentRequest {
  headers?: Headers;
  body?: string;
}

/**
 * Runs a request through the handler. `next` stands in for the rest of the chain: it records the
 * request it was given and responds with `content`.
 */
async function handle(request: SentRequest, content: unknown) {
  let sent: SentRequest | undefined;
  const next = (nextRequest: SentRequest) => {
    sent = nextRequest;
    return Promise.resolve({ request: nextRequest, response: null, content });
  };
  const context = { request } as unknown as RequestContext;
  // @ts-expect-error: The stand-in `next` only has what the handler uses.
  const response = (await JsonApiHandler.request(context, next)) as { content: unknown };

  return { sent: sent!, content: response.content };
}

module('Unit | Handler | json-api', function () {
  test('it singularizes the types of the resources from the API', async function (assert) {
    const { content } = await handle(
      {},
      {
        data: [
          { type: 'specials', id: '7', attributes: { title: 'BBQ Sandwich Meal' } },
          { type: 'specials', id: '6', attributes: { title: 'Meatloaf' } },
        ],
        included: [{ type: 'grab-and-gos', id: '3', attributes: {} }],
      }
    );

    assert.deepEqual(content, {
      data: [
        { type: 'special', id: '7', attributes: { title: 'BBQ Sandwich Meal' } },
        { type: 'special', id: '6', attributes: { title: 'Meatloaf' } },
      ],
      included: [{ type: 'grab-and-go', id: '3', attributes: {} }],
    });
  });

  test('it singularizes the type of a single resource', async function (assert) {
    const { content } = await handle({}, { data: { type: 'specials', id: '7', attributes: {} } });

    assert.deepEqual(content, { data: { type: 'special', id: '7', attributes: {} } });
  });

  test('it handles responses without a document', async function (assert) {
    const { content } = await handle({}, null);

    assert.strictEqual(content, null, 'such as a 204 from a delete');
  });

  test('it sends bodies as JSON:API', async function (assert) {
    const { sent } = await handle({ headers: new Headers(), body: '{"data":{}}' }, null);

    assert.strictEqual(sent.headers?.get('Content-Type'), 'application/vnd.api+json');
  });

  test('it keeps a Content-Type the request already has', async function (assert) {
    const { sent } = await handle(
      { headers: new Headers({ 'Content-Type': 'text/plain;charset=UTF-8' }), body: '[]' },
      null
    );

    assert.strictEqual(sent.headers?.get('Content-Type'), 'text/plain;charset=UTF-8');
  });

  test('it leaves requests without a body alone', async function (assert) {
    const { sent } = await handle({ headers: new Headers() }, null);

    assert.false(sent.headers?.has('Content-Type'));
  });
});
