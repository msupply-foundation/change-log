const OUTPUT = {
    TOKEN_INVALID: 'Invalid GitHub authentication token!',
    FETCH_MILESTONES_ISSUES: '\nFetching issues in Milestone: ',
    FETCHED_MILESTONES_ISSUES: '\nFetched issues by filters in Milestone: ',
    FETCH_SUCCESS: '\nSuccessful fetch!',
    FETCH_FAILED: '\nFailled to fetch!',
    DUPLICATED_ISSUES: 'Duplicating issues when has duplicated labels.',
    SINGLE_ISSUES: 'Not duplicating issues.',
    STARTED_GROUPED_CHANGES_LOG: 'Creating Changes-log for issues based on groups: ',
    STARTED_SINGLE_CHANGES_LOG: 'Creating Changes-log for issues without groups.',
    SAVED_FILE_CHANGES_LOG: '\nThe file has been saved!',
    CHANGE_LOG_INIT: '# ChangeLog for Milestone: ',
    CHANGES_FOR_CUSTOMER: '\n### For customer: ',
    CHANGES_FOR_ALL: '\n### For all customers:',
    ISSUES_TYPE: '\nIssues type: ',
    ISSUES_COUNT: 'Issues count: ',
    ISSUES_FOR_CUSTOMER: ' issues for customer: ',
    ISSUES_FOR_ALL_CUSTOMERS: ' issues for all customers.',
    DOTS: '...',
    NEWLINE: '\n',
    EXCLAMATION: '!',
    LIST: '- ',
    ISSUE_NUMBER_START: ' [',
    ISSUE_NUMBER_END: ']',
    SEPARATOR: '\n--------'
}

const proccessLogs = params => {
    return {
        token_invalid: OUTPUT.TOKEN_INVALID,
        fetch_starts: OUTPUT.FETCH_MILESTONES_ISSUES + params.milestone + OUTPUT.DOTS + OUTPUT.NEWLINE,
        fetch_finished: OUTPUT.FETCHED_MILESTONES_ISSUES + params.milestone + OUTPUT.EXCLAMATION + OUTPUT.NEWLINE,
        fetch_success: OUTPUT.FETCH_SUCCESS,
        fetch_failed: OUTPUT.FETCH_FAILED,
        duplicate_issues: OUTPUT.DUPLICATED_ISSUES + OUTPUT.NEWLINE,
        single_issues: OUTPUT.SINGLE_ISSUES + OUTPUT.NEWLINE,
        starts_grouped_changes_log: OUTPUT.STARTED_GROUPED_CHANGES_LOG + params.filter + OUTPUT.DOTS + OUTPUT.NEWLINE,
        starts_single_changes_log: OUTPUT.STARTED_SINGLE_CHANGES_LOG + OUTPUT.DOTS + OUTPUT.NEWLINE,
        saved_file_changes_log: OUTPUT.SAVED_FILE_CHANGES_LOG,
    };
};

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

module.exports = {
    initChangeLog,
    issuesChangeLog,
    proccessLogs,
    logIssuesCount,
};