const commander = require('commander');
const { getIssuesByMilestone } = require('./changesLogGenerator');

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .requiredOption('-m, --milestone <name>', 'must filter issue from milestone')
  .option('-d, --duplicate <allow>', 'Should allow duplicated issues (Default: true)')
  .option('-f, --filters <items>', 'comma separeted labels to filter issues', commaSeparatedList)
  .option('-g, --groups <items>', 'comma separated labels to group by issues', commaSeparatedList)
  .parse(process.argv);

const params = {
  duplicate: commander.duplicate ? false : true,
  milestone: commander.milestone,
  filters: commander.filters,
  groups: commander.groups
};

console.log(`Generating Changelog for Milestone ${params.milestone}...`)
console.log(`Duplicate issues (in different groups) set to: ${params.duplicate}.`)
if (params.filters !== undefined) console.log(`Filters: ${params.filters}`);
if (params.groups !== undefined) console.log(`Groups: ${params.groups}`);

printIssuesFromMilestone()

async function printIssuesFromMilestone() {
  const issues = await getIssuesByMilestone(params);
  console.log('Issues count', issues.length);
}
