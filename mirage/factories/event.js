import { Factory, trait } from 'ember-cli-mirage';
import { getYear, getMonth, getDay } from 'date-fns';
import faker from 'faker';

export default Factory.extend({
  startTime() {
    let date = faker.date.future();

    return new Date(
      getYear(date),
      getMonth(date),
      getDay(date),
      19,
      0,
      0
    );
  },
  endTime() {
    let date = this.startTime;

    return new Date(
      getYear(date),
      getMonth(date),
      getDay(date),
      22,
      0,
      0
    );
  },
  link() {
    return faker.internet.url();
  },

  pastEvent: trait({
    startTime() {
      let date = faker.date.past();

      return new Date(
        getYear(date),
        getMonth(date),
        getDay(date),
        19,
        0,
        0
      );
    },
    endTime() {
      let date = this.startTime;

      return new Date(
        getYear(date),
        getMonth(date),
        getDay(date),
        22,
        0,
        0
      );
    },
  }),

  futureEvent: trait({
    startTime() {
      let date = faker.date.future();

      return new Date(
        getYear(date),
        getMonth(date),
        getDay(date),
        19,
        0,
        0
      );
    },
    endTime() {
      let date = this.startTime;

      return new Date(
        getYear(date),
        getMonth(date),
        getDay(date),
        22,
        0,
        0
      );
    },
  })
});
