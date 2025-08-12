import Component from '@glimmer/component';
import { hash } from '@ember/helper';

interface MeatProduct {
  title: string;
  featured: boolean;
  items: string[];
}

export interface MeatProductsProviderSignature {
  Blocks: {
    default: [
      {
        products: MeatProduct[];
      },
    ];
  };
}

export default class MeatProductsProviderComponent extends Component<MeatProductsProviderSignature> {
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

  <template>{{yield (hash products=this.products)}}</template>
}
