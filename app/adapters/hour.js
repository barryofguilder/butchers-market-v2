import ApplicationAdapter from './application';

export default class HourAdapter extends ApplicationAdapter {
  urlForFindRecord(id /*, modelName, snapshot */) {
    return `server/hours.php?id=${id}`;
  }

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/hours.php';
  }

  urlForUpdateRecord(id /*, modelName, snapshot*/) {
    return `server/hours.php?id=${id}`;
  }

  urlForDeleteRecord(id /*, modelName, snapshot*/) {
    return `server/hours.php?id=${id}`;
  }
}
