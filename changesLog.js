const octokit = require('./githubAPI/octokit');
const commander = require('commander');
const fs = require('fs');
const { fetchIssuesInMilestone, generateChangesLog } = require('./helpers');
const { logs } = require('./constants');

const commaSeparatedList = value => value.split(',');

const validateState = value => (value === 'closed') || (value === 'open') || (value === 'all') ? value : null;

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .requiredOption('-m, --milestone <number>', 'must filter issue from milestone')
  .option('-c, --customer <customer>, will filter the issues related to a customer if this option is received')
  .option('-i, --includeIssueForAll <flag>', 'will include a section with issues done for all clients (Default: false)')
  .option('-s, --state <state>', 'should use issues with state: closed, open, all (Default: closed)', validateState)
  .option('-f, --filters <labels>', 'comma separated labels to filter and group by issues', commaSeparatedList)
  .option('-d, --duplicate <allow>', 'should allow duplicated issues in different groups (Default: true)')
  .parse(process.argv);

let groupedIssues = [];
const { filters } = commander;
const { milestone, customer, state = 'closed', duplicate = true, includeIssueForAll = true } = commander;
const params = { milestone, customer, state, duplicate, includeIssueForAll };

const fetchIssues = async () => {
  console.log(logs(params).fetch_starts);
  if(filters) {
    groupedIssues = await fetchIssuesInMilestone(octokit, params, filters);
    params.filters = filters;
    
    if (groupedIssues.length > 0) {
      console.log(logs(params).fetch_finished);
      console.log(params.duplicateIssues ? logs(params).duplicate_issues : logs(params).single_issues);
      console.log(logs(params).starts_grouped_changes_log);
      return true;
    } else return false;
  }
  else {
    groupedIssues = await fetchIssuesInMilestone(octokit, params);
    
    if (groupedIssues.length > 0) {
      console.log(logs(params).fetch_finished);
      console.log(logs(params).starts_single_changes_log);
      return true;
    } else return false;
  }
}

async function asyncGenerateChangesLog() {
  if(!octokit.asyncTryToken()) {
    console.log(logs(params).token_invalid);
    return;
  }

  if(await fetchIssues()) {
    console.log(logs(params).fetch_success);
    const changesLog = generateChangesLog(groupedIssues, params);
    fs.writeFile('changesLog.txt', changesLog, (err) => {
      if (err) throw err;
      console.log(logs(params).saved_file_changes_log);
    });
  } else console.log(logs(params).fetch_failed);

}

asyncGenerateChangesLog();
