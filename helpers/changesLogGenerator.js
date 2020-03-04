const { getTitle, initChangeLog, issuesChangeLog } = require('../constants');

let issuesNumbersIncluded = [];

const checkForDuplication = (issue, duplicateIssues) => {
  if(duplicateIssues === true) return issuesChangeLog(issue).issue_line;

  const duplicate = issuesNumbersIncluded
   .some(numberIncluded => (numberIncluded === issue.number));
  if (!duplicate) {
    issuesNumbersIncluded.push(issue.number);
    return issuesChangeLog(issue).issue_line;
  }
}

module.exports.generateChangesLog = function (groupIssues, {duplicateIssues, milestone}) {
  let changesLog = initChangeLog(milestone);

  groupIssues.forEach(group => {
    const { forCustomer, noCustomer } = group.issues;

    const title = getTitle(group.key);
    if(title) changesLog += title;

    if (group.customer){
      changesLog += issuesChangeLog(group).changes_for_customer;
      forCustomer
       .forEach(issue=> changesLog += checkForDuplication(issue, duplicateIssues));
    }
    if (group.customer && noCustomer.length > 0 ){
      changesLog += issuesChangeLog(group).changes_for_all;
    }
    noCustomer
     .forEach(issue => changesLog += checkForDuplication(issue, duplicateIssues));
  });
  return changesLog;
}
