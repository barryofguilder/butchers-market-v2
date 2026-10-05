import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import MenuValidations from '../../../validations/menu';
import FormState from '../../../utils/form-state';
import baseUrl from '../../../utils/base-url';
import { generatePdfFileName } from '../../../utils/file-name';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class MenuFormComponent extends Component {
  @service router;
  @service session;

  form = new FormState(this.args.menu, MenuValidations);

  @tracked file;
  @tracked tempFileUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get hasFile() {
    return this.form.get('fileUrl') || this.tempFileUrl;
  }

  get fileUrl() {
    if (this.tempFileUrl) {
      return this.tempFileUrl;
    }

    return this.form.get('fileUrlPath');
  }

  get saveDisabled() {
    return this.form.isInvalid;
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

  saveMenu = dropTask(async () => {
    this.form.validate();

    const hasFile = this.file || this.form.get('fileUrl');

    if (!this.form.isValid || !hasFile) {
      if (!hasFile) {
        this.form.addError('file', 'PDF URL is required');
      }

      return;
    }

    try {
      if (this.file) {
        const generatedFileName = generatePdfFileName(this.file);
        await this.file.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.form.set('fileUrl', generatedFileName);
      }

      await this.form.save();
      this.args.saved();
    } catch (ex) {
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else {
        this.errorMessage = await getErrorMessageFromException(ex);
      }
    }
  });

  uploadFileTask = enqueueTask({ maxConcurrency: 3 }, async (file) => {
    try {
      let url = await file.readAsDataURL();
      this.tempFileUrl = url;
      this.file = file;
      this.form.removeError('file');
    } catch (ex) /* eslint-disable-line no-unused-vars */ {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  @action
  uploadFile(file) {
    this.form.set('fileUrl', null);
    this.uploadFileTask.perform(file);
  }
}
