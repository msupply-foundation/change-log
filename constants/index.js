const { TEXT_PATH } = require('./path');
const { PREFIXES } = require('./labels');
const { getTitle, checkSomeLabelEquals, checkSomeLabelHasPrefix } = require('./labels');
const { initChangeLog, issuesChangeLog, proccessLogs, logIssuesCount } = require('./logs');

module.exports = {
  PREFIXES,
  TEXT_PATH,
  getTitle,
  checkSomeLabelEquals,
  checkSomeLabelHasPrefix,
  initChangeLog,
  issuesChangeLog,
  proccessLogs,
  logIssuesCount
};
