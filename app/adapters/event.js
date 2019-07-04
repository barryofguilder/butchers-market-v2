import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id /*, modelName, snapshot */) {
    return `server/events.php?id=${id}`;
  },

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/events.php';
  },

  urlForUpdateRecord(id /*, modelName, snapshot*/) {
    return `server/events.php?id=${id}`;
  },

  urlForDeleteRecord(id /*, modelName, snapshot*/) {
    return `server/events.php?id=${id}`;
  },
});
