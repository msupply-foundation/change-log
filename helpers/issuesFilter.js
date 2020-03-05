const { LABEL_GROUPS, logIssuesCount, checkSomeLabelEquals, isLabelGroup } = require('../constants');

const fetchIssuesInMilestoneByFilters = async (octokit, params) {
    const { customer, includeIssueForAll } = params;

    const filterIssuesForCustomer = function (issues) {
      return issues.filter( issue => checkSomeLabelEquals(issue.labels, LABEL_GROUPS.CUSTOMER, customer));
    }

    const filterIssuesForAnyCustomer = function (issues) {
      return issues.filter( issue => !issue.labels.some(label => isLabelGroup( label, LABEL_GROUPS.CUSTOMER)));
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

const fetchIssuesByFilter = async (octokit, params, group) => {
  const issueParams = { ...params, filter: group };
  return await fetchIssuesInMilestoneByFilters(octokit, issueParams);
}

const fetchIssuesUsingParams = async (octokit, params) => {
  const { customer } = params;
  const issues = await fetchIssuesInMilestoneByFilters(octokit, params);
  return [ { customer, issues } ]);
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

   issues.forEach(group => console.log(logIssuesCount(group)));

  return issues;
}
