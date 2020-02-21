const prefixes = require('./constants/labelsPrefixes');
require('dotenv').config();

module.exports.getIssuesByMilestone = async function  (octokit, params) {
    const { customer, includeIssueForAll } = params;
    console.log(params);

    const filteredIssues = await octokit.getIssues(params);
    if (!customer) return { 'issues': filteredIssues };

    const customerIssues = filteredIssues.filter( issue => issue.labels.some( ({name}) => name === customer ));
    if(!includeIssueForAll) return { 'customerIssues': customerIssues };

    const allCustomersIssues = filteredIssues.filter( issue => !(issue.labels.any( ({name}) => name.startWith(prefixes.CUSTOMER))))
    return { 'customerIssues': customerIssues, 'allIssues': allCustomersIssues };
}

module.exports.generateChangesLog = function (groupIssues, milestone) {
  let changesLog = `# Changes Log for Milestone ${milestone}\n\n`;
  let issuesNumbersIncluded = [];
  

  const checkForDuplication = function (issueNumber,issuesNumbersIncluded) {
    const existingIssue = issuesNumbersIncluded.some(numberIncluded => (numberIncluded === issueNumber));
    if (!existingIssue) {
      issuesNumbersIncluded.push(issueNumber);
      return true;
    } else return false;
  }
  
  groupIssues.forEach(({key, issues, customer}) => {
    if (customer) changesLog = `Changes required for ${customer}`;
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
      if(checkForDuplication(issue.number,issuesNumbersIncluded)) {
        changesLog += `\n- ${issue.title} [${issue.number}]`
      }
    })

  });
  return changesLog;
}