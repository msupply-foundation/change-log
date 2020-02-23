const octokit = require('./githubAPI/octokit');
const commander = require('commander');
const fs = require('fs');
const { fetchIssuesInMilestone, generateChangesLog } = require('./helpers');

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
  .option('-i, --includeAll <flag>', 'will include a section with issues done for all clients (Default: false)')
  .option('-s, --state <state>', 'should use issues with state: closed, open, all (Default: closed)', checkValidStates)
  .option('-f, --filters <labels>', 'comma separated labels to filter and group by issues', commaSeparatedList)
  .option('-d, --duplicate <allow>', 'should allow duplicated issues in different groups (Default: true)')
  .parse(process.argv);

let groupedIssues = [];
const filters = commander.filters;
const params = {
  milestone: commander.milestone,
  state: commander.state ? commander.state : 'closed',
  customer: commander.customer ? commander.customer : undefined,
  duplicateIssues: commander.duplicate ? commander.duplicate : true,
  includeIssueForAll: commander.includeAll ? commander.includeAll : true
};

async function fetchIssues() {
  console.log(`\n\nFetching issues in Milestone ${params.milestone}...\n`);
  if(filters) {
    groupedIssues = await fetchIssuesInMilestone(octokit, params, filters);
    
    if (groupedIssues.length > 0) {
      console.log(`\nFinished fetching issues by filters in Milestone ${params.milestone}!\n`);
      console.log(`Duplicate issues (in different groups) set to: ${params.duplicateIssues}.\n`);
      console.log(`Started creating Changes log for issues based on Groups: ${filters}...\n`);
      return true;
    } else return false;
  }
  else {
    groupedIssues = await fetchIssuesInMilestone(octokit, params);
    
    if (groupedIssues.length > 0) {
      console.log(`\nFinished fecthing issues in Milestone ${params.milestone}!\n`);
      console.log('Started creating Changes lof for issues in single block...\n');
      return true;
    } else return false;
  }
}

async function asyncGenerateChangesLog() {
  if(!octokit.asyncTryToken()) {
    console.log('The token is not valid!');
    return;
  }

  if(await fetchIssues()) {
    console.log('\nSuccessful fetch!');
    const changesLog = generateChangesLog(groupedIssues, params);
    fs.writeFile('changesLog.txt', changesLog, (err) => {
      if (err) throw err;
      console.log('\nThe file has been saved!');
    });
  } else console.log('\nFailled to fetch!');

}

asyncGenerateChangesLog();