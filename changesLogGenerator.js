const { Octokit } = require("@octokit/rest");
require('dotenv').config();

module.exports.getIssuesByMilestone = async function  (params) {
    const { milestone, filter, state } = params;
    const { owner, repo } = params;

    const octokit = new Octokit({
      auth: process.env.WEBHOOK_SECRET
    });

    if(!owner) {
      if(process.env.OWNER) owner = process.env.OWNER;      
    }

    if(!repo){
      if(process.env.OWNER) repo = process.env.REPO;
    }

    if(!owner || !repo){
      console.log('Missing repo and owner to user. Please add correct environment variables to file .env!')
      return [];    
    }
    if(!octokit.auth) {
      console.log('Missing authentication token. Please add correct environment variable to file .env!');
      return [];
    }

    console.log(params);

    await octokit.registerEndpoints({
      misc: {
        getRoot: {
          method: "GET",
          url: "/"
        }
      }
    });

    const options = octokit.issues.listForRepo.endpoint.merge({
      owner,
      repo,
      milestone,
      state,
      labels: filter
    });

    const issuesAndPRs = await octokit.paginate(options);
    const onlyIssues = issuesAndPRs.filter( issue => (!issue.pull_request))
    return onlyIssues;
}