const OUTPUT = {
    BUG_FIXES_TITLE: '\n\n## Bug fixes',
    CHANGE_LOG_INIT: '# ChangeLog for Milestone: ',
    CHANGE_FOR_CUSTOMER: '\n### For customer: ',
    CHANGE_FOR_ALL: '\n### For all customers:',
    COLON: ':',
    DOTS: '...',
    DUPLICATED_ISSUES: 'Duplicating issues when has duplicated labels.',
    EXCLAMATION: '!',
    FEATURES_TITLE: '\n\n## New Features',
    FETCH_MILESTONES_ISSUES: '\nFetching issues in Milestone: ',
    FETCHED_MILESTONES_ISSUES: '\nFetched issues by filters in Milestone: ',
    FETCH_FAILED: '\nFailled to fetch!',
    IMPROVEMENTS_TITLE: '\n\n## Improvements',
    ISSUES_TYPE: '\nIssues type: ',
    ISSUES_COUNT: 'Issues count: ',
    ISSUES_FOR_CUSTOMER: ' issues for customer: ',
    ISSUES_FOR_ALL_CUSTOMERS: ' issues for all customers.',
    ISSUE_NUMBER_START: ' [',
    ISSUE_NUMBER_END: ']',
    LIST: '- ',
    MISSING_TOKEN: 'Missing authentication token. Please add correct environment variable to file .env!',
    NEWLINE: '\n',
    NO_TITLE_PRESET: '\n\n## No title preset for ',
    SINGLE_ISSUES: 'Not duplicating issues.',
    SAVED_FILE_CHANGE_LOG: '\nThe file has been saved!',
    SEPARATOR: '\n--------\n',
    STARTED_GROUPED_CHANGE_LOG: 'Creating Change-log for issues based on groups: ',
    STARTED_SINGLE_CHANGE_LOG: 'Creating Change-log for issues without groups.',
    TOKEN_INVALID: 'Invalid GitHub authentication token!',
}

const groupTitleChangeLog = (group, type) => {
    return (group) ? ((type) ? OUTPUT.NO_TITLE_PRESET + group + OUTPUT.COLON + type : OUTPUT.NO_TITLE_PRESET + group) : null;
}

const initChangeLog = milestoneNumber => OUTPUT.CHANGE_LOG_INIT + milestoneNumber

const issuesChangeLog = issue => {
    return {
        title_change_for_customer: OUTPUT.CHANGE_FOR_CUSTOMER + issue.customer,
        title_change_for_all: OUTPUT.CHANGE_FOR_ALL,
        block_end: OUTPUT.SEPARATOR,
        issue_line: OUTPUT.NEWLINE + OUTPUT.LIST + issue.title + OUTPUT.ISSUE_NUMBER_START + issue.number + OUTPUT.ISSUE_NUMBER_END,
    };
}

const logIssuesCount = (group) => {
    const { issues, key, customer } = group;
    const { forCustomer, noCustomer } = issues;
    let logger = OUTPUT.ISSUES_TYPE + key + OUTPUT.NEWLINE;
    if(customer) {
        logger += noCustomer.length + OUTPUT.ISSUES_FOR_ALL_CUSTOMERS + OUTPUT.NEWLINE
                + forCustomer.length + OUTPUT.ISSUES_FOR_CUSTOMER + customer + OUTPUT.NEWLINE;
    } else logger += OUTPUT.ISSUES_COUNT + noCustomer.length + OUTPUT.NEWLINE;
    return logger;
}

const proccessLogs = params => {
    return {
        duplicate_issues: OUTPUT.DUPLICATED_ISSUES + OUTPUT.NEWLINE,
        fetch_starts: OUTPUT.FETCH_MILESTONES_ISSUES + params.milestone + OUTPUT.DOTS + OUTPUT.NEWLINE,
        fetch_finished: OUTPUT.FETCHED_MILESTONES_ISSUES + params.milestone + OUTPUT.EXCLAMATION + OUTPUT.NEWLINE,
        fetch_failed: OUTPUT.FETCH_FAILED,
        saved_file_change_log: OUTPUT.SAVED_FILE_CHANGE_LOG,
        single_issues: OUTPUT.SINGLE_ISSUES + OUTPUT.NEWLINE,
        starts_grouped_change_log: OUTPUT.STARTED_GROUPED_CHANGE_LOG + params.filters,
        starts_single_change_log: OUTPUT.STARTED_SINGLE_CHANGE_LOG + OUTPUT.DOTS + OUTPUT.NEWLINE,
        token_invalid: OUTPUT.TOKEN_INVALID,
    };
};

module.exports = {
    OUTPUT,
    groupTitleChangeLog,
    initChangeLog,
    issuesChangeLog,
    logIssuesCount,
    proccessLogs,
};