import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeatController extends Controller {
  queryParams = ['packages'];

  @tracked packages = false;

  get meatBundlePDF() {
    const packageBundles = this.model.packageBundles;

    // This is a really hacky way to get the same PDF that we use for the "Mix N' Match" section.
    let mixnmatch = packageBundles.findBy('title', `Mix N' Match`);
    if (mixnmatch) {
      return mixnmatch.fileUrlPath;
    }

    return '';
  }
}
