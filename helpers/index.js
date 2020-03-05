const { fetchIssuesInMilestone } = require('./issuesFilter');
const { generateChangeLog } = require('./changeLogGenerator');

module.exports = {
  fetchIssuesInMilestone,
  generateChangeLog
}
