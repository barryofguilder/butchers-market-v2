import Component from '@glimmer/component';

export default class MeatProductsProviderComponent extends Component {
  products = [
    {
      title: 'Pork',
      featured: false,
      items: ['Natural', 'No hormones used', 'Product of the USA'],
    },
    {
      title: 'Beef',
      featured: true,
      items: [
        'Only 8% of all beef meets our standards',
        'Natural',
        '30 day average aging',
        'Quality is more selective than USDA grading',
        'Product of the USA',
      ],
    },
    {
      title: 'Chicken',
      featured: false,
      items: ['Natural', 'No hormones used', 'Only small young tender birds', 'Product of the USA'],
    },
  ];
}
