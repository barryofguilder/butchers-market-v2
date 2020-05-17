import Service from '@ember/service';

export default class LocalStorageService extends Service {
  getItem(key) {
    return localStorage.getItem(key);
  }

  setItem(key, content) {
    localStorage.setItem(key, content);
  }

  removeItem(key) {
    return localStorage.removeItem(key);
  }
}
