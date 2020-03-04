const { getTitle, initChangeLog, issuesChangeLog } = require('../constants');

const generateChangesLog = (groupIssues, {duplicateIssues, milestone}) => {
  
  let issuesNumbersIncluded = [];
  const isDuplicateIssue = (issue) => {
    const isDuplicate = issuesNumbersIncluded
    .some(numberIncluded => numberIncluded === issue.number);
   if (!isDuplicate) {
     issuesNumbersIncluded.push(issue.number);
     return issuesChangeLog(issue).issue_line;
   }
  }

  let changesLog = initChangeLog(milestone);

  groupIssues.forEach(group => {
    const { forCustomer, noCustomer } = group.issues;

    const title = getTitle(group.key);
    if (title) changesLog += title;

    if (group.customer) {
      changesLog += issuesChangeLog(group).title_changes_for_customer;
      forCustomer.forEach(issue=> {
        const addIssue = (duplicateIssues) ? true : isDuplicateIssue(issue);
        if (addIssue) changesLog += issuesChangeLog(issue).issue_line;
      });
    }
    if (group.customer && noCustomer.length > 0 ){
      changesLog += issuesChangeLog(group).title_changes_for_all;
    }

    noCustomer.forEach(issue => {
       const addIssue = (duplicateIssues) ? true : isDuplicateIssue(issue);
       if (addIssue) changesLog += issuesChangeLog(issue).issue_line;
     });
  });
  return changesLog;
}

module.exports = {
  generateChangesLog
};