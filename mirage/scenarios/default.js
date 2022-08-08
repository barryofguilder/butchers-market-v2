import addDays from 'date-fns/addDays';

export default function (server) {
  createDeliItems(server);
  createHours(server);
  createMeatBundles(server);
  createMenu(server);
  createPackageBundles(server);
  createReviews(server);
  createSpecials(server);
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
    displayOrder: 1,
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
    displayOrder: 2,
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
    displayOrder: 3,
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
    displayOrder: 4,
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
    displayOrder: 5,
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
    displayOrder: 6,
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
    displayOrder: 7,
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
    displayOrder: 8,
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
    displayOrder: 9,
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

function createMenu(server) {
  server.create('menu');
}

function createPackageBundles(server) {
  server.create('package-bundle', {
    title: "Mix N' Match",
    displayOrder: 1,
    flyerDownloadLink: 'docs/bundles-mixnmatch.pdf',
    fileUrl: 'docs/bundles-mixnmatch.pdf',
    prices: ['Pick 5 for $53', 'Pick 10 for $99', 'Pick 20 for $195'],
    items: [
      '2 (7 oz.) Beef Ribeye Steaks',
      '2 (7 oz.) Beef N.Y. Strip Steaks',
      '2 lbs. Beef Chuck Roast',
      '2 lbs. Beef Chuck Tender Roast',
      '2 lbs. Beef Sirloin Tip Roast',
      '2 lbs. Beef Cube Steaks',
      '2 lbs. Beef Stew',
      '2 ½ lbs. Beef Ground Chuck',
      '2 ¼ lbs. Beef Ground Round',
      '2 ½ lbs. Boneless Pork Chops',
      '5 lbs. Boston Butt Pork Roast',
      '4 lbs. Country Style Pork Ribs',
      '2 ½ lbs. Baby Back Pork Ribs',
      '3 lbs. Fresh Made Pork Sausage',
      '3 lbs. Bratwurst or Italian Sausages',
      '3 lbs. Smoked Pork Sausage',
      '2 ½ lbs. Sliced Slab Bacon',
      '2 ½ lbs. Boneless Chicken Breast',
      '2 ½ lbs. Boneless Chicken Tenders',
      '4 ½ lbs. Split Chicken Breast',
      '5 lbs. Chicken Wings',
      '4 lbs. Tilapia or Swai Fish Fillets',
      '2 lbs. Raw Shrimp',
      '2 (4oz.) Lobster Tails',
    ],
  });

  server.create('package-bundle', {
    title: "Ice Box Mix N' Match",
    displayOrder: 2,
    flyerDownloadLink: 'docs/iceboxflyer.pdf',
    fileUrl: 'docs/iceboxflyer.pdf',
    prices: ['Pick 5 for $19.99', 'Pick 10 for $37.99', 'Pick 20 for $75.99'],
    items: [
      'Spicy Chicken Tenders',
      'Popcorn Chicken',
      'Breaded Chicken Tenders',
      'Breaded Chicken Nuggets',
      'Breaded Chicken Fries',
      'Breaded Chicken Wings',
      'Meatballs',
      'Corndogs',
      'Mini Corndogs',
      'Sausage Biscuits',
      'Sausage Croissants',
      'Sausage, Egg, Cheese Biscuits',
      'Chicken Biscuits',
      'Cheeseburger Sliders',
      'Chicken Sliders',
      'Chicken Tamales',
      'Breaded Fish Sticks',
      'Pepperoni Pizzas',
      'Supreme Pizza',
      'Cooked Sausage Patties',
      'Hash Brown Patties',
      'Crinkle Cut Fries',
      'Tater Tots',
      'Seasoned Potato Wedges',
      'Sweet Potato Fries',
      'Steak Cut Fries',
      'Shoestring Fries',
      'Mixed Vegetables',
      'California Blend Mix Vegetables',
      'Cut Green Beans',
      'Butter Peas',
      'Breaded Okra',
      'Sliced Yellow Squash',
      'Corn on the Cob',
      'Shoepeg Cut Corn',
      'Onion Rings',
      'Hush Puppies',
      'Corn Nuggets',
      'Yeast Rolls',
      'Garlic Cheese Breadstick',
      'Southern Style Biscuits',
      'Belgian Waffles',
      'Cinnamon Rolls',
      'Chocolate Chip Cookies',
    ],
  });
}

function createReviews(server) {
  server.create('review', { imageUrl: 'images/review-person1.jpg' });
  server.create('review', { imageUrl: 'images/review-person2.png' });
  server.create('review', { imageUrl: 'images/review-person3.png' });
}

function createSpecials(server) {
  server.create('special', {
    title: 'Smoked Boneless Turkey Breast',
    imageUrl: 'images/thanksgivingbreast.jpg',
    activeStartDate: addDays(new Date(), -5),
    isSoldOut: false,
  });

  server.create('special', {
    title: 'Italian Lasagne',
    imageUrl: 'images/thanksgivingbreast.jpg',
    isSoldOut: true,
  });

  server.create('special', {
    title: 'Meatloaf',
    imageUrl: 'images/thanksgivingbreast.jpg',
    activeStartDate: addDays(new Date(), -6),
    isSoldOut: false,
  });

  server.create('special', {
    title: 'Beef Stew',
    imageUrl: 'images/thanksgivingbreast.jpg',
    activeStartDate: addDays(new Date(), -14),
    activeEndDate: addDays(new Date(), -2),
    isSoldOut: false,
  });
}
