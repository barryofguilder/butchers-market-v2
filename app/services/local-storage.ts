import Service from '@ember/service';

export default class LocalStorageService extends Service {
  getItem(key: string) {
    return localStorage.getItem(key);
  }

  setItem(key: string, content: string) {
    localStorage.setItem(key, content);
  }

  removeItem(key: string) {
    return localStorage.removeItem(key);
  }
}
