const { Octokit } = require("@octokit/rest");
require('dotenv').config();

module.exports.getIssuesByMilestone = async function  (params) {
    const { milestone, duplicate, filters, groups } = params;
    console.log(params);

    const octokit = new Octokit({
      auth: process.env.WEBHOOK_SECRET
    });

    await octokit.issues.listForRepo({
      owner: process.env.OWNER,
      repo: process.env.REPO
    })
    .then(({data}) => {
      console.log('1 issues count', data.length);
    }).catch(e => {
      console.log('error', e);
    });

    await octokit.registerEndpoints({
      misc: {
        getRoot: {
          method: "GET",
          url: "/"
        }
      }
    });
    const options = octokit.issues.listForRepo.endpoint.merge({
      owner: process.env.OWNER,
      repo: process.env.REPO
    });

    octokit.paginate(options)
      .then(issues => {
          console.log('2 issues count', issues.length);
      });
}
