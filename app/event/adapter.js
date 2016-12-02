import ApplicationAdapter from '../application/adapter';

export default ApplicationAdapter.extend({
  urlForFindRecord(id/*, modelName, snapshot */) {
    return `server/events.php/${id}`;
  },

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/events.php';
  },

  urlForUpdateRecord(id/*, modelName, snapshot*/) {
    return `server/events.php/${id}`;
  },

  urlForDeleteRecord(id/*, modelName, snapshot*/) {
    return `server/events.php/${id}`;
  }
});
