const { getTitle, initChangeLog, issuesChangeLog } = require('../constants');

const generateChangeLog = (groupIssues, {duplicateIssues, milestone}) => {
  
  let issuesNumbersIncluded = [];
  const isDuplicateIssue = (issue) => {
    const isDuplicate = issuesNumbersIncluded
    .some(numberIncluded => numberIncluded === issue.number);
   if (!isDuplicate) {
     issuesNumbersIncluded.push(issue.number);
     return issuesChangeLog(issue).issue_line;
   }
  }

  let changeLog = initChangeLog(milestone);

  groupIssues.forEach(group => {
    const { issues, key, customer } = group;
    const { forCustomer, noCustomer } = issues;

    const title = getTitle(key);
    if (title) changeLog += title;

    if (customer) {
      changeLog += issuesChangeLog(group).title_change_for_customer;
      forCustomer.forEach(issue=> {
        const addIssue = (duplicateIssues) ? true : isDuplicateIssue(issue);
        if (addIssue) changeLog += issuesChangeLog(issue).issue_line;
      });
    }
    if (customer && noCustomer.length > 0 ){
      changeLog += issuesChangeLog(group).title_change_for_all;
    }

    noCustomer.forEach(issue => {
       const addIssue = (duplicateIssues) ? true : isDuplicateIssue(issue);
       if (addIssue) changeLog += issuesChangeLog(issue).issue_line;
     });
     changeLog += issuesChangeLog(group).block_end;
  });
  return changeLog;
}

module.exports = {
  generateChangeLog
};
