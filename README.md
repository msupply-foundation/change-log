# change-log
Generates .txt files using Markdown notation with the "Change log" of the repository given a Repo and a Milestone to use.

## Usage
`.env.example` file should be renamed to `.env` and have the REPO, OWNER, WEBHOOK_SECRET. 

You can create a token for you to use here: https://github.com/settings/tokens. The page will ask you to log in and then select the scope of the token - tick the repo scope. Click 'Generate token' to use as the webhook secret. 

The WEBHOOK_SECRET is the token you just generated. 
The OWNER is the organisation name for the Github repository that you want to create a changelog for, and the REPO is the repository name. 

`yarn install` to install the node packages that you need. 

`node changeLog.js -h` - Show the help with required arguments for this call

### Examples 
`node changeLog.js -m <number>` - Only required argument. Passing a Milestone number will generate a change log file for all the issues closed in the Milestone. Currently this uses the milestone number, not the milestone name. To get the milestone number, click on the milestone in your repository, and use the number at the end of the link. TODO: Use the Milestone name [Issue](https://github.com/openmsupply/changes-log/issues/2).

`node changeLog.js -m <number> -f "Feature: new, Feature: existing, Bug: production"` - By giving filters will generate a change-log file for all the issues closed in the Milestone, divided per filter.

`node changeLog.js -m <number> -c "Customer: X` - By passing a customer will generate a change-log file for all the issues closed in the Milestone for that customer.

Other default arguments can also change what issues are included:
 - `-s` Status: `closed` (Default), `open` or `all`
 - `-d` Duplicate Issues: `false` (Default) or `true`
 - `-i` Include Issue for All: `true` (Default) or `false`  
