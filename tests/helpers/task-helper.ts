import { task } from 'ember-concurrency';

/**
 * A class to help stub out ember concurrency tasks.
 *
 * @class TaskHelper
 */
export class TaskHelper {
  _promise: Promise<unknown>;
  declare finishTask: (value?: unknown) => unknown;

  constructor() {
    this._promise = new Promise((resolve) => {
      this.finishTask = resolve;
    });
  }

  task = task(async () => {
    await this._promise;
  });
}
