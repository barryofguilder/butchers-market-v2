import ApplicationAdapter from './application';

export default class EventAdapter extends ApplicationAdapter {
  urlForFindRecord(id /*, modelName, snapshot */) {
    return `server/events.php?id=${id}`;
  }

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/events.php';
  }

  urlForUpdateRecord(id /*, modelName, snapshot*/) {
    return `server/events.php?id=${id}`;
  }

  urlForDeleteRecord(id /*, modelName, snapshot*/) {
    return `server/events.php?id=${id}`;
  }
}
