import type { TOC } from '@ember/component/template-only';

/**
 * Route templates are rendered as template-only components that receive the route's resolved
 * `model` and its `controller` as named arguments. Use this to type them:
 *
 * ```gts
 * const MyTemplate: RouteTemplate<Special[], MyController> = <template>
 *   {{@controller.title}}
 *   {{#each @model as |special|}}{{special.title}}{{/each}}
 * </template>;
 *
 * export default MyTemplate;
 * ```
 *
 * Templates that use neither argument don't need this at all — export the `<template>` directly.
 */
export type RouteTemplate<Model = never, Controller = never> = TOC<{
  Args: {
    controller: Controller;
    model: Model;
  };
}>;
