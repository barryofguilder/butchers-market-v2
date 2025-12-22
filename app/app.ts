import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import config from "./config/environment";
import 'butchers-market/font-awesome';
import 'butchers-market/app.css';
import '@warp-drive/ember/install';

import compatModules from "@embroider/virtual/compat-modules";

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
