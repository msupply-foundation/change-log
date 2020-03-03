const { TEXT_PATH } = require('./path');
const { LABEL_GROUPS } = require('./labels');
const { getTitle, checkSomeLabelEquals, checkSomeLabelHasPrefix } = require('./labels');
const { initChangeLog, issuesChangeLog, proccessLogs, logIssuesCount } = require('./logs');

module.exports = {
  LABEL_GROUPS,
  TEXT_PATH,
  getTitle,
  checkSomeLabelEquals,
  checkSomeLabelHasPrefix,
  initChangeLog,
  issuesChangeLog,
  proccessLogs,
  logIssuesCount
};
