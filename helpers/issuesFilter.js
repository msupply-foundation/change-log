const { prefixes, checkSomeLabelEquals, checkSomeLabelHasPrefix } = require('../constants');

async function fetchIssuesInMilestoneByFilters (octokit, params) {
    const { customer, includeIssueForAll } = params;

    const filterIssuesForCustomer = function (issues) {
      return issues.filter( issue => checkSomeLabelEquals(issue.labels, prefixes.CUSTOMER, customer));
    }

    const filterIssuesForAnyCustomer = function (issues) {
      return issues.filter( issue => !checkSomeLabelHasPrefix(issue.labels, prefixes.CUSTOMER));
    }

    const issues = await octokit.getIssues(params);

    if(customer && !includeIssueForAll) {
      return { forCustomer: filterIssuesForCustomer(issues) };
    }
    else if(customer){
      return {
        forCustomer: filterIssuesForCustomer(issues),
        noCustomer: filterIssuesForAnyCustomer(issues)
      };
    }
    else return { noCustomer: issues };
}

async function fetchIssuesByFilter(octokit, params, group){
  params.filter = group;
  return await fetchIssuesInMilestoneByFilters(octokit, params);
}

async function fetchIssuesUsingParams(octokit, params) {
  const allIssues = [];
  allIssues.push({
    customer: params.customer,
    issues: await fetchIssuesInMilestoneByFilters(octokit, params)
  });
  return allIssues;
}

async function asyncForEach (array, octokit, params, callback) {
  const groupedIssues = [];
  for (let index = 0; index < array.length; index++) {
    groupedIssues.push({
      key: array[index].trimLeft(),
      customer: params.customer,
      issues: await callback(octokit, params, array[index].trimLeft())
    });
  }
  return groupedIssues;
}

module.exports.fetchIssuesInMilestone = async function (octokit, params, filters) {
  const issues = (!filters) ? await fetchIssuesUsingParams(octokit, params)
   : await asyncForEach(filters, octokit, params, fetchIssuesByFilter);

   issues.forEach(group => {
    const { forCustomer, noCustomer } = group.issues;
    (group.key) ? console.log('\nIssues type:', group.key) : console.log('\n');
    if(group.customer){
      console.log('No costumer:', noCustomer.length);
      console.log('For', group.customer, ':', forCustomer.length);
    } 
    else {
      console.log('Issues count:', noCustomer.length);
    }
  });

  return issues;
}
