export default function(server) {
  server.loadFixtures();

  createDeliItems(server);
  createEvents(server);
  createHours(server);
  createMeatBundles(server);
  createPerformances(server);
  createReviews(server);
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

function createMeatBundles(server) {
  server.create('meat-bundle', {
    title: '20lb Meat Pack',
    price: '$68',
    featured: true,
    items: [
      '5lb. Ground Chuck',
      '5lb. Bonesless Chicken Breasts',
      '5lb. Boston Butt Pork Roast',
      '5lb. Bonelesss Pork Chops',
    ],
  });

  server.create('meat-bundle', {
    title: '30lb Meat Pack',
    price: '$77',
    featured: false,
    items: [
      '5 lbs. Fresh Ground Chuck',
      '3 1/2 lbs. Boneless Pork Chops',
      '4 lbs. Country Style Pork Ribs',
      '2 1/2 lbs. Market Style Bacon',
      '5 lbs. Boneless Chicken Breasts',
      '10 lbs. Chicken Leg Quarters',
    ],
  });

  server.create('meat-bundle', {
    title: '40lb Meat Pack',
    price: '$114',
    featured: false,
    items: [
      '4 lbs. Beef Chuck Roast',
      '10 lbs. Fresh Ground Chuck',
      '5 lbs. Boneless Pork Chops',
      '5 lbs. Boston Butt Pork Roast',
      '6 lbs. Bone-In Chicken Breasts',
      '10 lbs. Chicken Leg Quarters',
    ],
  });

  server.create('meat-bundle', {
    title: '50lb Meat Pack',
    price: '$129',
    featured: true,
    items: [
      '10lb. Fresh Ground Chuck',
      '10lb. Boneless Pork Chops',
      '10lb. Country Style Pork Ribs',
      '10lb. Boneless Chicken Breasts',
      '10lb. Chicken Leg Quarters',
    ],
  });

  server.create('meat-bundle', {
    title: '75lb Meat Pack',
    price: '$235',
    featured: false,
    items: [
      '4 (7 oz.) Beef Ribeye Steaks',
      '4 (7 oz.) Beef N.Y. Strip Steaks',
      '2 lbs. Beef Chuck Roast',
      '2 lbs. Beef Cubed Steak',
      '2 lbs. Beef Stew Meat',
      '10 lbs. Beef Ground Chuck',
      '10 lbs. Boneless Pork Chops',
      '5 lbs. Boston Butt Pork Roast',
      '4 lbs. Country Style Pork Ribs',
      '3 lbs. Pork Sausage',
      '2 1/2 lbs. Sliced Smoked Bacon',
      '10 lbs. Boneless Chicken Breasts',
      '6 lbs. Bone-In Chicken Breasts',
      '10 lbs. Chicken Leg Quarters',
      '5 lbs. Chicken Wings',
    ],
  });

  server.create('meat-bundle', {
    title: '100lb Meat Pack',
    price: '$325',
    featured: false,
    items: [
      '10 lbs. Beef Chuck Roast',
      '20 lbs. Fresh Ground Chuck',
      '10 lbs. Boneless Pork Chops',
      '10 lbs. Country Style Pork Ribs',
      '10 lbs. Boston Butt Pork Roast',
      '10 lbs. Pork Sausage',
      '10 lbs. Sliced Smoked Bacon',
      '10 lbs. Boneless Chicken Breasts',
      '10 lbs. Chicken Leg Quarters',
    ],
  });

  server.create('meat-bundle', {
    title: 'Bundle Meat Pack #1',
    price: '$69',
    featured: false,
    items: [
      '4 (7oz) Beef Ribeye Steaks',
      '2 lbs. Beef Cube Steaks',
      '5 lbs. Beef Ground Chuck',
      '2 ½ lbs. Boneless Pork Chops',
      '3 lbs. Split Chicken Breasts',
    ],
  });

  server.create('meat-bundle', {
    title: 'Bundle Meat Pack #2',
    price: '$69',
    featured: false,
    items: [
      '4 (7oz) Beef N.Y. Strip Steaks',
      '2 lbs. Beef Stew',
      '5 lbs. Beef Ground Chuck',
      '2 ½ lbs. Boneless Chicken Breast',
      '2 ½ lbs. Boneless Pork Chops',
    ],
  });

  server.create('meat-bundle', {
    title: 'Mega Bundle',
    price: '$119',
    featured: true,
    items: [
      '2 (7 oz.) Ribeye Steaks',
      '2 (7 oz.) N.Y. Strip Steaks',
      '2lb. Beef Chuck Roast',
      '2lb. Beef Cube Steak',
      '5lb. Beef Ground Chuck',
      '5lb. Boneless Pork Chops',
      '3lb. Pork Sausage',
      '2 1/2 lb. Sliced Slab Bacon',
      '10lb. Bone-in Chicken Breast',
    ],
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

function createReviews(server) {
  server.create('review', { image: 'images/review-person1.jpg' });
  server.create('review', { image: 'images/review-person2.png' });
  server.create('review', { image: 'images/review-person3.png' });
}
