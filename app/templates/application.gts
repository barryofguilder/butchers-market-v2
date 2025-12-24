import { pageTitle } from 'ember-page-title';
import AnalyticsScripts from '../components/analytics-scripts';
import MainNav from '../components/main-nav';
import MainFooter from '../components/main-footer';

<template>
  {{pageTitle "The Butcher's Market in Dalton, GA"}}

  <AnalyticsScripts />
  <MainNav />

  <div class='mt-20'>
    {{outlet}}
  </div>

  <MainFooter class='mt-24' />
</template>
