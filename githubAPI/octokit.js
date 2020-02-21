const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const octokit = new Octokit({
  auth: process.env.WEBHOOK_SECRET
});

if(!octokit.auth) {
  console.log('Missing authentication token. Please add correct environment variable to file .env!');
  return undefined;
}

module.exports.getIssues = async function(params) {
  const { milestone, filter, state, owner, repo } = params;
  
  await octokit.registerEndpoints({
    misc: {
      getRoot: {
        method: "GET",
        url: "/"
      }
    }
  });

  const options = octokit.issues.listForRepo.endpoint.merge({
    owner: owner ? owner : process.env.OWNER,
    repo: repo ? repo : process.env.REPO,
    milestone,
    state,
    labels: filter
  });

  const issuesAndPRs = await octokit.paginate(options);
  const onlyIssues = issuesAndPRs.filter( issue => (!issue.pull_request))
  return onlyIssues;
}