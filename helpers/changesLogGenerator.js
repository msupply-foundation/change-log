
let issuesNumbersIncluded = [];

function checkForDuplication(issue, duplicateIssues) {
  if(duplicateIssues === true) return `\n- ${issue.title} [${issue.number}]`;

  const duplicate = issuesNumbersIncluded.some(numberIncluded => (numberIncluded === issue.number));
  if (!duplicate) {
    issuesNumbersIncluded.push(issue.number);
    return `\n- ${issue.title} [${issue.number}]`;
  }
}

module.exports.generateChangesLog = function (groupIssues, {duplicateIssues, milestone}) {
  let changesLog = `# Changes Log for Milestone ${milestone}\n\n`;

  groupIssues.forEach(group => {
    const { forCustomer, noCustomer } = group.issues;

    switch(group.key) {
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
    if (group.customer){
      changesLog += `\n\n### For customer: ${group.customer}`;
      forCustomer.forEach(issue=> changesLog += checkForDuplication(issue, duplicateIssues));
    }
    if (group.customer && noCustomer.length > 0 ){
      changesLog += '\n--------\n### For all customers:';
    }
    noCustomer.forEach(issue => changesLog += checkForDuplication(issue, duplicateIssues));
    changesLog += '\n--------\n';
  });
  return changesLog;
}