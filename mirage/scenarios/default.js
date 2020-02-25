export default function(server) {
  server.loadFixtures();

  createDeliItems(server);
  createEvents(server);
  createHours(server);
  createPerformances(server);
}

function createDeliItems(server) {
  server.create('deli-item', {
    title: 'Rotisserie Chicken Salad',
    ingredients: 'grapes, pecans',
  });

  server.create('deli-item', {
    title: 'Traditional Chicken Salad',
    ingredients: 'pimientos, tomatoes, carrots',
  });

  server.create('deli-item', {
    title: 'Olive Salad',
    ingredients: 'assorted olives, garlic, cocktail onions, assorted peppers, pimientos',
  });

  server.create('deli-item', {
    title: 'Pimiento Cheese',
    ingredients: null,
  });

  server.create('deli-item', {
    title: 'Broccoli Salad',
    ingredients: 'broccoli, cauliflower, tomatoes, red onion, ranch dressing',
  });

  server.create('deli-item', {
    title: 'Fresh Salsa',
    ingredients: null,
  });

  server.create('deli-item', {
    title: 'Bacon Ranch Potato Salad',
    ingredients: null,
  });

  server.create('deli-item', {
    title: 'Original Twice Baked Potato',
    ingredients: 'milk, butter, sour cream, cheddar cheese, chives',
  });
}

function createEvents(server) {
  server.createList('event', 4, {
    title: 'Blues Street House Band',
    leadIn: 'Classic Rock with',
  });

  server.createList('event', 3, {
    title: 'Lon Eldridge',
    leadIn: `Sounds from the 20's & 30's with`,
  });

  server.createList('event', 2, {
    title: 'Ben Honeycutt',
    leadIn: `Acoustic Evening with`,
  });

  server.create('event', {
    title: 'Backwater Still',
    leadIn: '',
  });

  server.createList('event', 3, 'pastEvent', {
    title: 'Across Five Aprils',
    leadIn: 'A night of metal with',
  });
}

function createHours(server) {
  server.create('hour', {
    type: 'Store',
    default: true,
    label: 'Store Hours',
    line1: 'Mon - Sat: 9:00am - 6:00pm',
    line2: 'Sun: Closed',
    line3: null,
  });

  server.create('hour', {
    type: 'Cafe',
    default: true,
    label: 'Cafe Hours',
    line1: 'Mon - Thurs: 9:00am - 5:30pm',
    line2: 'Fri & Sat: 9:00am - 10:00pm, last call 9:30pm',
    line3: 'Sun: Closed',
  });

  server.create('hour', {
    type: 'Store',
    default: false,
    label: 'Store Hours (holiday)',
    line1: 'Closed',
    line2: null,
    line3: null,
  });

  server.create('hour', {
    type: 'Cafe',
    default: false,
    label: 'Cafe Hours (holiday)',
    line1: 'Closed',
    line2: null,
    line3: null,
  });
}

function createPerformances(server) {
  server.create('performance', {
    title: 'Blues Street House Band - Give Me One Reason',
    link: 'https://www.youtube.com/watch?v=XMEDXOZL5Do',
  });

  server.create('performance', {
    title: 'Curtis Loew - Blues Street House Band 2.17.18',
    link: 'https://www.youtube.com/watch?v=BFw5yBbmzqY',
  });

  server.create('performance', {
    title: 'Do It Again - The Buckner Brothers',
    link: 'https://www.youtube.com/watch?v=frd_IdCGtj4',
  });

  server.create('performance', {
    title: 'Lon Eldridge - China Town',
    link: 'https://www.youtube.com/watch?v=yDYxlQHpjFE',
  });
}
