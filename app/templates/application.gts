import { pageTitle } from 'ember-page-title';
import MainNav from '../components/main-nav';
import MainFooter from '../components/main-footer';

<template>
  {{pageTitle "The Butcher's Market in Dalton, GA"}}

  <MainNav />

  <div class='mt-20'>
    {{outlet}}
  </div>

  <MainFooter class='mt-24' />
</template>
