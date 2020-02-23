const { fetchIssuesInMilestone } = require('./issuesFilter');
const { generateChangesLog } = require('./changesLogGenerator');

module.exports = {
  fetchIssuesInMilestone,
  generateChangesLog
}
