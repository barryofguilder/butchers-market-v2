import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import MenuValidations from 'butchers-market/validations/menu';
import { dropTask, enqueueTask } from 'ember-concurrency';
import baseUrl from 'butchers-market/utils/base-url';

export default class MenuFormComponent extends Component {
  @service router;
  @service session;

  changeset;

  @tracked tempFileUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasFile() {
    return this.changeset.get('fileUrl') || this.tempFileUrl;
  }

  get fileUrl() {
    if (this.tempFileUrl) {
      return this.tempFileUrl;
    }

    return this.changeset.get('fileUrlPath');
  }

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  get uploadHeaders() {
    const token = this.session.token;

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return null;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.menu,
      lookupValidator(MenuValidations),
      MenuValidations
    );

    this.changeset = changeset;
  }

  @dropTask
  *saveMenu() {
    yield this.changeset.validate();

    const hasFile = this.changeset.file || this.changeset.fileUrl;

    if (!this.changeset.isValid || !hasFile) {
      if (!hasFile) {
        this.changeset.addError('file', 'PDF URL is required');
      }

      return;
    }

    try {
      if (this.changeset.file) {
        let response = yield this.changeset.file.upload(`${baseUrl}/upload/pdf`, {
          headers: this.uploadHeaders,
        });
        this.changeset.set('fileUrl', response.body);
      }

      yield this.changeset.save();
      this.args.saved();
    } catch (ex) {
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  }

  @enqueueTask({ maxConcurrency: 3 })
  *uploadFileTask(file) {
    try {
      let url = yield file.readAsDataURL();
      this.tempFileUrl = url;
      this.changeset.set('file', file);
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  }

  @action
  uploadFile(file) {
    this.changeset.set('fileUrl', null);
    this.uploadFileTask.perform(file);
  }
}
