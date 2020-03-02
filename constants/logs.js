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
    DOTS: '...',
    NEWLINE: '\n',
    EXCLAMATION: '!',
}

const logs = params => {
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

module.exports = {
    logs
};