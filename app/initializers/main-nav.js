export function initialize(application) {
  application.inject('component:main-nav', 'applicationRoute', 'route:application');
}

export default {
  name: 'main-nav',
  initialize,
};
