import { module, test } from 'qunit';
import sortBy from 'butchers-market/helpers/sort-by';

interface Person {
  name: string;
  age: number;
  nick: string | null | undefined;
}

const people: Person[] = [
  { name: 'charlie', age: 30, nick: null },
  { name: 'Alice', age: 42, nick: 'al' },
  { name: 'bob', age: 30, nick: undefined },
  { name: 'dave', age: 7, nick: 'd' },
];

function names(sorted: Person[]) {
  return sorted.map((person) => person.name);
}

module('Unit | Helper | sort-by', function () {
  test('it sorts strings ascending, ignoring case', function (assert) {
    assert.deepEqual(names(sortBy('name', people)), ['Alice', 'bob', 'charlie', 'dave']);
  });

  test('a `:desc` suffix reverses the sort', function (assert) {
    assert.deepEqual(names(sortBy('name:desc', people)), ['dave', 'charlie', 'bob', 'Alice']);
  });

  test('it sorts numbers ascending', function (assert) {
    assert.deepEqual(names(sortBy('age', people)), ['dave', 'charlie', 'bob', 'Alice']);
  });

  test('it keeps null and undefined values last', function (assert) {
    assert.deepEqual(names(sortBy('nick', people)), ['Alice', 'dave', 'charlie', 'bob']);
  });

  test('it sorts by more than one key', function (assert) {
    assert.deepEqual(names(sortBy('age', 'name', people)), ['dave', 'bob', 'charlie', 'Alice']);
  });

  test('the keys can be passed as a single array', function (assert) {
    assert.deepEqual(names(sortBy(['age', 'name'], people)), names(sortBy('age', 'name', people)));
  });

  test('it accepts a comparator function', function (assert) {
    const byAgeDescending = (a: Person, b: Person) => b.age - a.age;

    assert.deepEqual(names(sortBy(byAgeDescending, people)), ['Alice', 'charlie', 'bob', 'dave']);
  });

  test('it does not mutate the array it is given', function (assert) {
    const input = [...people];

    sortBy('name', input);

    assert.deepEqual(names(input), ['charlie', 'Alice', 'bob', 'dave']);
  });

  test('it handles an empty or missing array', function (assert) {
    assert.deepEqual(sortBy('name', []), []);
    assert.deepEqual(sortBy('name', undefined), []);
  });

  test('it returns an empty array when given no keys', function (assert) {
    assert.deepEqual(sortBy(people), []);
  });
});
