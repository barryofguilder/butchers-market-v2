import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
  faArrowsAltV,
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleNotch,
  faExclamationTriangle,
  faMapMarkerAlt,
  faPencilAlt,
  faPhone,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

// Disable auto CSS import into head. It solved the side effect for jumping icon size.
// This is required for Fastboot apps, otherwise build fails
// It's the recommended way for setup Font Awesome in your app
config.autoAddCss = false;

library.add(
  faArrowsAltV,
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleNotch,
  faExclamationTriangle,
  faMapMarkerAlt,
  faPencilAlt,
  faPhone,
  faPlus,
  faTrashAlt,
);
