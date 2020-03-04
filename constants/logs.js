const OUTPUT = {
    BUG_FIXES_TITLE: '\n\n## Bug fixes',
    CHANGE_LOG_INIT: '# ChangeLog for Milestone: ',
    CHANGES_FOR_CUSTOMER: '\n### For customer: ',
    CHANGES_FOR_ALL: '\n### For all customers:',
    COLON: ':',
    DOTS: '...',
    DUPLICATED_ISSUES: 'Duplicating issues when has duplicated labels.',
    EXCLAMATION: '!',
    FEATURES_TITLE: '\n\n## New Features',
    FETCH_MILESTONES_ISSUES: '\nFetching issues in Milestone: ',
    FETCHED_MILESTONES_ISSUES: '\nFetched issues by filters in Milestone: ',
    FETCH_SUCCESS: '\nSuccessful fetch!',
    FETCH_FAILED: '\nFailled to fetch!',
    IMPROVEMENT_TITLE: '\n\n## Improvements',
    ISSUES_TYPE: '\nIssues type: ',
    ISSUES_COUNT: 'Issues count: ',
    ISSUES_FOR_CUSTOMER: ' issues for customer: ',
    ISSUES_FOR_ALL_CUSTOMERS: ' issues for all customers.',
    ISSUE_NUMBER_START: ' [',
    ISSUE_NUMBER_END: ']',
    LIST: '- ',
    NEWLINE: '\n',
    NO_TITLE_PRESET: '\n\n## No title preset for ',
    SINGLE_ISSUES: 'Not duplicating issues.',
    SAVED_FILE_CHANGES_LOG: '\nThe file has been saved!',
    SEPARATOR: '\n--------',
    STARTED_GROUPED_CHANGES_LOG: 'Creating Changes-log for issues based on groups: ',
    STARTED_SINGLE_CHANGES_LOG: 'Creating Changes-log for issues without groups.',
    TOKEN_INVALID: 'Invalid GitHub authentication token!',
}

const groupTitleChangeLog = (group, type) => {
    return (group) ? ((type) ? OUTPUT.NO_TITLE_PRESET + group + OUTPUT.COLON + type : OUTPUT.NO_TITLE_PRESET + group) : null;
}

const initChangeLog = milestoneNumber => OUTPUT.TITLE_1 + OUTPUT.CHANGE_LOG_INIT + milestoneNumber

const issuesChangeLog = issue => {
    return {
        changes_for_customer: OUTPUT.CHANGES_FOR_CUSTOMER + issue.customer,
        changes_for_all: OUTPUT.SEPARATOR + OUTPUT.CHANGES_FOR_ALL,
        issue_line: OUTPUT.NEWLINE + OUTPUT.LIST + issue.title + OUTPUT.ISSUE_NUMBER_START + issue.number + OUTPUT.ISSUE_NUMBER_END,
    };
}

const logIssuesCount = (group) => {
    const { forCustomer, noCustomer } = group.issues;
    let logger = OUTPUT.ISSUES_TYPE + group.key + OUTPUT.NEWLINE;
    if(group.customer) {
        logger += noCustomer.length + OUTPUT.ISSUES_FOR_ALL_CUSTOMERS + OUTPUT.NEWLINE
                + forCustomer.length + OUTPUT.ISSUES_FOR_CUSTOMER + group.customer + OUTPUT.NEWLINE;
    } else logger += OUTPUT.ISSUES_COUNT + noCustomer.length + OUTPUT.NEWLINE;
    return logger;
}

const proccessLogs = params => {
    return {
        duplicate_issues: OUTPUT.DUPLICATED_ISSUES + OUTPUT.NEWLINE,
        fetch_starts: OUTPUT.FETCH_MILESTONES_ISSUES + params.milestone + OUTPUT.DOTS + OUTPUT.NEWLINE,
        fetch_finished: OUTPUT.FETCHED_MILESTONES_ISSUES + params.milestone + OUTPUT.EXCLAMATION + OUTPUT.NEWLINE,
        fetch_success: OUTPUT.FETCH_SUCCESS,
        fetch_failed: OUTPUT.FETCH_FAILED,
        saved_file_changes_log: OUTPUT.SAVED_FILE_CHANGES_LOG,
        single_issues: OUTPUT.SINGLE_ISSUES + OUTPUT.NEWLINE,
        starts_grouped_changes_log: OUTPUT.STARTED_GROUPED_CHANGES_LOG + params.filter + OUTPUT.DOTS + OUTPUT.NEWLINE,
        starts_single_changes_log: OUTPUT.STARTED_SINGLE_CHANGES_LOG + OUTPUT.DOTS + OUTPUT.NEWLINE,
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