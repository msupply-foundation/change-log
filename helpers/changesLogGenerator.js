module.exports.generateChangesLog = function (groupIssues, {duplicateIssues, milestone}) {
  let changesLog = `# Changes Log for Milestone ${milestone}\n\n`;
  let issuesNumbersIncluded = [];

  const checkForDuplication = function (issue,issuesNumbersIncluded, callback) {
    const existingIssue = issuesNumbersIncluded.some(numberIncluded => (numberIncluded === issue.number));
    if (!existingIssue) {
      issuesNumbersIncluded.push(issueNumber);
      callback(issue);
    }
  }

  groupIssues.forEach(({key, issues, customer}) => {
    if (customer) changesLog += `Changes required for ${customer}`;
    switch(key) {
      case 'Feature: new':
        changesLog += `\n\n## New Features`;
        break;
      case 'Feature: existing':
        changesLog += `\n\n## Improvements`;
        break;
      case 'Bug: production':
        changesLog += `\n\n## Bug fixes`;
        break;
    }
    issues.forEach(issue => {
      changesLog += (duplicateIssues) ? `\n- ${issue.title} [${issue.number}]` :
      checkForDuplication(issue.number,issuesNumbersIncluded), (issue => {
        changesLog += `\n- ${issue.title} [${issue.number}]`
      });
    });
  });
  return changesLog;
}
