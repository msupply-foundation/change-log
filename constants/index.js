const { TEXT_PATH } = require('./path');
const { LABEL_GROUPS } = require('./labels');
const { getTitle, checkSomeLabelEquals, isLabelGroup } = require('./labels');
const { groupTitleChangeLog, initChangeLog, issuesChangeLog, logIssuesCount, proccessLogs } = require('./logs');

module.exports = {
  LABEL_GROUPS,
  TEXT_PATH,
  getTitle,
  checkSomeLabelEquals,
  isLabelGroup,
  groupTitleChangeLog,
  initChangeLog,
  issuesChangeLog,
  logIssuesCount,
  proccessLogs,
};
