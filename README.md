# change-log
Generates .txt files using Markdown notation with the "Change log" of the given a Repo and a Milestone to use.

## Usage
`.env.example` file should be renamed to `.env` and have the REPO, OWNER, WEBHOOK_SECRET (You can create a token for you to use here: https://github.com/settings/tokens )

`node changeLog.js -h` - Show the help with required arguments for this call

### Examples 
`node changeLog.js -m <number>` - Only required argument. Passing a Milestone number will generate a change log file for all the issues closed in the Milestone. TODO: Use the Milestone name [Issue](https://github.com/openmsupply/changes-log/issues/2).

`node changeLog.js -m <number> -f "Feature: new, Feature: existing, Bug: production"` - By giving filters will generate a change-log file for all the issues closed in the Milestone, divided per filter.

`node changeLog.js -m <number> -c "Customer: X` - By passing a customer will generate a change-log file for all the issues closed in the Milestone for that customer.

Other default arguments can also send to change what issues are included:
 - -s Status: closed (Default), open or all
 - -d Duplicate Issues: false (Default) or true
 - -i Include Issue for All: true (Default) or false  
