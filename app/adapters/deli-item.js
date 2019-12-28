import ApplicationAdapter from './application';

export default class DeliItemAdapter extends ApplicationAdapter {
  urlForFindRecord(id /*, modelName, snapshot */) {
    return `server/deliItems.php?id=${id}`;
  }

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/deliItems.php';
  }

  urlForUpdateRecord(id /*, modelName, snapshot*/) {
    return `server/deliItems.php?id=${id}`;
  }

  urlForDeleteRecord(id /*, modelName, snapshot*/) {
    return `server/deliItems.php?id=${id}`;
  }
}
