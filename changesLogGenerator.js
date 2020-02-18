const { Octokit } = require("@octokit/rest");
require('dotenv').config();

module.exports.getIssuesByMilestone = async function  (params) {
    const { milestone, duplicate, filters, groups } = params;
    const { owner, repo } = params;

    const octokit = new Octokit({
      auth: process.env.WEBHOOK_SECRET
    });
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
      owner: owner ? owner : process.env.OWNER,
      repo: repo ? repo : process.env.REPO,
      milestone,
      state: 'all'
    });

    return await octokit.paginate(options);
}
