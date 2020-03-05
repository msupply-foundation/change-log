const { LABEL_GROUPS, logIssuesCount, checkSomeLabelEquals, isLabelGroup } = require('../constants');

const filterIssuesForCustomer = (issues, customer) => {
  return issues.filter( issue => checkSomeLabelEquals(issue.labels, LABEL_GROUPS.CUSTOMER, customer));
}

const filterIssuesForAnyCustomer = (issues) => {
  return issues.filter( issue => !issue.labels.some(label => isLabelGroup( label, LABEL_GROUPS.CUSTOMER)));
}

const fetchIssuesInMilestoneByFilters = async (octokit, params) => {
    const { customer, includeIssueForAll } = params;

    const issues = await octokit.getIssues(params);

    if(customer && !includeIssueForAll) {
      return { forCustomer: filterIssuesForCustomer(issues, customer) };
    }
    else if(customer){
      return {
        forCustomer: filterIssuesForCustomer(issues, customer),
        noCustomer: filterIssuesForAnyCustomer(issues)
      };
    }
    else return { noCustomer: issues };
}

const fetchIssuesByFilter = async (octokit, params, group) => {
  const issueParams = { ...params, filter: group };
  return await fetchIssuesInMilestoneByFilters(octokit, issueParams);
}

const fetchIssuesUsingParams = async (octokit, params) => {
  const { customer } = params;
  const issues = await fetchIssuesInMilestoneByFilters(octokit, params);
  return [ { customer, issues } ];
}

const asyncForEach = async (filters, octokit, params, fetchIssuesByFilter) => {
  const { customer } = params;
  filters = filters.map(filter => filter.trimLeft());
  return await Promise.all(filters.map(async filter =>  {
    return {
      key: filter,
      customer,
      issues: await fetchIssuesByFilter(octokit, params, filter),
    }
  }));
}

const fetchIssuesInMilestone = async (octokit, params, filters) => {
  const issues = (!filters) ? await fetchIssuesUsingParams(octokit, params)
   : await asyncForEach(filters, octokit, params, fetchIssuesByFilter);

  issues.forEach(group => console.log(logIssuesCount(group)));

  return issues;
}

module.exports = {
  fetchIssuesInMilestone
};