import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id /*, modelName, snapshot */) {
    return `server/packageBundles.php?id=${id}`;
  },

  urlForCreateRecord(/*modelName, snapshot*/) {
    return 'server/packageBundles.php';
  },

  urlForUpdateRecord(id /*, modelName, snapshot*/) {
    return `server/packageBundles.php?id=${id}`;
  },

  urlForDeleteRecord(id /*, modelName, snapshot*/) {
    return `server/packageBundles.php?id=${id}`;
  },
});
