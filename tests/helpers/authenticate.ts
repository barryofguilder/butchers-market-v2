import { TOKEN } from 'butchers-market/utils/local-storage';

function base64Url(value: object) {
  return btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Signs in by storing an unsigned JWT that expires in a week, which is enough for the `admin`
 * route. Call it in `beforeEach` and pair it with `setupAuthentication` so the token is removed.
 */
export function authenticate() {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const header = base64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = base64Url({ username: 'test', iat: Math.floor(Date.now() / 1000), exp });

  localStorage.setItem(TOKEN, `${header}.${payload}.signature`);
}

/**
 * Signs in before each test and signs out after it.
 */
export function setupAuthentication(hooks: NestedHooks) {
  hooks.beforeEach(function () {
    authenticate();
  });

  hooks.afterEach(function () {
    localStorage.removeItem(TOKEN);
  });
}
