import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import config from 'butchers-market/config/environment';
import 'butchers-market/font-awesome';
import 'butchers-market/app.css';
import '@warp-drive/ember/install';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
