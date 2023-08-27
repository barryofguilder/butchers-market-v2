import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function htmlSafeHelper([html]: [string]) {
  return htmlSafe(html);
}

export default helper(htmlSafeHelper);
