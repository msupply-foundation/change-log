const { Octokit } = require('@octokit/rest');
require('dotenv').config();
const { OUTPUT } = require('../constants');

const octokit = new Octokit({
  auth: process.env.WEBHOOK_SECRET,
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }
});

if(!octokit.auth) {
  console.log(OUTPUT.MISSING_TOKEN);
  return ocktokit;
}

const isValidToken = async () => {
  let checkToken = false;
  checkToken = await octokit.repos.get({
    owner: process.env.OWNER,
    repo: process.env.REPO,
    mediaType: {
      previews: ["symmetra"]
    }
  })
  .catch( e => {
    console.log(e);
    return checkToken;
  });
  return checkToken;
}

const getIssues = async (params) => {
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

  const issuesPullRequests = await octokit.paginate(options);
  const issues = issuesPullRequests.filter( issue => (!issue.pull_request))
  return issues;
}

module.exports = { isValidToken, getIssues };
