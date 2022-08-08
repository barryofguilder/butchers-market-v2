import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  title() {
    const wordCount = faker.datatype.number({ min: 2, max: 4 });
    return faker.lorem.words(wordCount);
  },

  // deprecated!
  flyerDownloadLink() {
    return 'docs/bundles-mixnmatch.pdf';
  },

  fileUrl() {
    return 'docs/bundles-mixnmatch.pdf';
  },

  prices() {
    return ['Pick 5 for $53', 'Pick 10 for $99', 'Pick 20 for $195'];
  },

  items() {
    return [
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
    ];
  },
});
