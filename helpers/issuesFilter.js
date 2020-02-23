const { prefixes } = require('../constants');

async function getIssuesByMilestone (octokit, params) {
    const { customer, includeIssueForAll } = params;

    const filterIssuesForCustomer = function (issues) {
      return issues.filter( issue =>
        issue.labels.some(({name}) => name === `${prefixes.CUSTOMER} ${customer}`));
    }

    const filterIssuesForAnyCustomer = function (issues) {
      return issues.filter( issue =>
        !issue.labels.some(({name}) => {
          const labelPrefixAndValue = name.split(':');
          return (labelPrefixAndValue.length > 0) ? `${labelPrefixAndValue[0]}:` === prefixes.CUSTOMER : faslse;
        })
      );
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
  return await getIssuesByMilestone(octokit, params);
}

async function fetchIssuesUsingParams(octokit, params, groupedIssues) {
  const allIssues = [];
  allIssues.push({
    customer: params.customer,
    issues: await getIssuesByMilestone(octokit, params)
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

module.exports.fetchIssuesInMilestone = async function (octokit, params, groupedIssues, filters) {
  groupedIssues = (!filters) ? await fetchIssuesUsingParams(octokit, params, groupedIssues)
   : await asyncForEach(filters, octokit, params, fetchIssuesByFilter);

  groupedIssues.forEach(group => {
    const { forCustomer, noCustomer } = group.issues;
    console.log('\nIssues type:', group.key);
    console.log('No costumer:', noCustomer.length);
    console.log('For', group.customer, ':', forCustomer.length);
  });

  return true; // TODO: Check for Successful fetch!
}
