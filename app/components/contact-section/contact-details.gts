import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const ContactDetails: TOC<{
  Element: HTMLDivElement;
  Args: EmptyObject;
  Blocks: EmptyObject;
}> = <template>
  <div>
    <h3 class='text-red-700 text-xl sm:text-3xl uppercase tracking-wide font-black'>
      Contact Us
    </h3>
    <p class='mt-2 sm:mt-4 sm:text-xl'>We welcome any feedback or questions you may have big or
      small!</p>
    <p class='mt-4 text-gray-700 text-sm'>
      <span class='font-bold'>Note:</span>
      This form is not intended for placing orders or for inquiries needing immediate response. Your
      information is not shared with any third party and will only be used for our communications
      with you. If you need immediate assistance, call us at
      <a class='hover:border-b hover:border-gray-700' href='tel:7062799277'>
        (706) 279-9277
      </a>.
    </p>
  </div>
</template>;

export default ContactDetails;
