import ApplicationAdapter from 'butchers-market/application/adapter';

export default ApplicationAdapter.extend({
  urlForFindRecord(id/*, modelName, snapshot */) {
    return `server/hours.php?id=${id}`;
  },

  urlForUpdateRecord(id/*, modelName, snapshot*/) {
    return `server/hours.php?id=${id}`;
  }
});
