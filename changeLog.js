const octokit = require('./githubAPI/octokit');
const commander = require('commander');
const fs = require('fs');
const { fetchIssuesInMilestone, generateChangeLog } = require('./helpers');
const { proccessLogs, TEXT_PATH } = require('./constants');

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

const { filters } = commander;
const { milestone, customer, state = 'closed', duplicate = true, includeIssueForAll = true } = commander;
const params = { milestone, customer, state, duplicate, includeIssueForAll };

const fetchIssues = async () => {
  console.log(proccessLogs(params).fetch_starts);
 
  groupedIssues = await fetchIssuesInMilestone(octokit, params, filters);
  if (groupedIssues.length > 0) {
    console.log(proccessLogs(params).fetch_finished);
    if (filters) {
      params.filters = filters;
      console.log(params.duplicateIssues ? proccessLogs(params).duplicate_issues : proccessLogs(params).single_issues);
    }
    console.log(proccessLogs(params).starts_grouped_change_log);
    return groupedIssues;
  } else return [];
}

const asyncGenerateChangeLog = async () => {
  const isValidToken = await octokit.isValidToken();
  if (!isValidToken) {
    console.log(proccessLogs(params).token_invalid);
    return;
  }

  const issuesInMilestone = await fetchIssues();
  
  if(issuesInMilestone.length > 0) {
    const changeLog = generateChangeLog(issuesInMilestone, params);
    fs.writeFile(TEXT_PATH, changeLog, (err) => {
      if (err) throw err;
      console.log(proccessLogs(params).saved_file_change_log);
    });
  } else console.log(proccessLogs(params).fetch_failed);
}

asyncGenerateChangeLog();
