const commander = require('commander');
const { getIssuesByMilestone } = require('./changesLogGenerator');

function commaSeparatedList(value) {
  return value.split(',');
}

function checkValidStates(value) {
  return (value === 'closed') || (value === 'open') || (value === 'all') ? value : undefined;
}

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .requiredOption('-m, --milestone <name>', 'must filter issue from milestone')
  .option('-d, --duplicate <allow>', 'Should allow duplicated issues in different groups (Default: true)')
  .option('-s, --state <state>', 'Should use issues with state: closed, open, all (Default: closed)', checkValidStates)
  .option('-f, --filters <labels>', 'comma separated labels to filter and group by issues', commaSeparatedList)
  .parse(process.argv);

let sucessfulFetch = false;
const params = {
  milestone: commander.milestone,
  state: commander.state ? commander.state : 'closed'
};
const filters = commander.filters;
const duplicateIssues = commander.duplicate ? commander.duplicate : true;

console.log(`\n\nFetching issues in Milestone ${params.milestone}...\n`)

async function printIssuesUsingParams(filter) { 
  if(filter) params.filter = filter.trimStart();
  const issues = await getIssuesByMilestone(params);
  if( issues.length > 0){
    console.log('Issues count', issues.length);
    if(!sucessfulFetch) sucessfulFetch = true;
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const printIssuesUsingFilters = async (filters) => {
  await asyncForEach(filters, printIssuesUsingParams); 
}

async function fetchIssues() {
  if(filters) {
    await printIssuesUsingFilters(filters);
    if(sucessfulFetch){
      console.log(`\nFinished fetching issues by filters in Milestone ${params.milestone}!\n\n`);
      console.log(`Duplicate issues (in different groups) set to: ${duplicateIssues}.\n\n`);
      console.log(`Started creating Changes log for issues based on Groups: ${filters}...\n`);
      return true;
    } else return false;
  }
  else {
    await printIssuesUsingParams();
    if(sucessfulFetch) {
      console.log(`\nFinished fecthing issues in Milestone ${params.milestone}!\n\n`);
      console.log('Started creating Changes lof for issues in single block...\n\n');
      return true
    } else return false;
  }
}

fetchIssues();