const octokit = require('./githubAPI/octokit');
const commander = require('commander');
const fs = require('fs');
const { getIssuesByMilestone, generateChangesLog } = require('./changesLogGenerator');

function commaSeparatedList(value) {
  return value.split(',');
}

function checkValidStates(value) {
  return (value === 'closed') || (value === 'open') || (value === 'all') ? value : undefined;
}

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .requiredOption('-m, --milestone <number>', 'must filter issue from milestone')
  .option('-c, --customer <customer>, will filter the issues related to a customer if this option is received')
  .option('-i, --includeAll <notes>', 'will include a section with issues done for all clients (Default: true)')
  .option('-s, --state <state>', 'should use issues with state: closed, open, all (Default: closed)', checkValidStates)
  .option('-f, --filters <labels>', 'comma separated labels to filter and group by issues', commaSeparatedList)
  .option('-d, --duplicate <allow>', 'should allow duplicated issues in different groups (Default: true)')
  .parse(process.argv);

let groupedIssues = [];
let successfulFectch = false;
const params = {
  milestone: commander.milestone,
  state: commander.state ? commander.state : 'closed'
};
if(commander.customer) params.customer = commander.customer;
const filters = commander.filters;
const duplicateIssues = commander.duplicate ? commander.duplicate : true;

console.log(`\n\nFetching issues in Milestone ${params.milestone}...\n`)

async function fetchIssuesUsingParams(filter) { 
  if(filter) params.filter = filter.trimStart();
  const result = await getIssuesByMilestone(octokit, params);
  const { issues, customerIssues } = result;
  if(issues.length > 0){
    console.log('Issues count', issues.length);
    if(!successfulFectch) successfulFectch = true;
    if(filter){
      const group = filter.trimStart();
      groupedIssues.push({ key: group, issues });
    }
    else groupedIssues.push({ issues });
  }
  if(customerIssues && customerIssues.length > 0){
    if(!successfulFectch) successfulFectch = true;
    if(filter){
      const group = filter.trimStart();
      groupedIssues.push({ key: group, issues: customerIssues, customer });
    }
    else groupedIssues.push({ customerIssues });
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const fetchIssuesUsingFilters = async (filters) => {
  await asyncForEach(filters, fetchIssuesUsingParams); 
}

async function fetchIssues() {
  if(filters) {
    await fetchIssuesUsingFilters(filters);
    if(successfulFectch){
      console.log(`\nFinished fetching issues by filters in Milestone ${params.milestone}!\n\n`);
      console.log(`Duplicate issues (in different groups) set to: ${duplicateIssues}.\n\n`);
      console.log(`Started creating Changes log for issues based on Groups: ${filters}...\n`);
      return true;
    } else return false;
  }
  else {
    await fetchIssuesUsingParams();
    if(successfulFectch) {
      console.log(`\nFinished fecthing issues in Milestone ${params.milestone}!\n\n`);
      console.log('Started creating Changes lof for issues in single block...\n\n');
      return true;
    } else return false;
  }
}

async function asyncGenerateChangesLog() {
  if(await fetchIssues()) {
    console.log('success');
    const changesLog = generateChangesLog(groupedIssues, params.milestone);
    fs.writeFile('changesLog.txt', changesLog, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  } else console.log('failled');
  
}

asyncGenerateChangesLog();