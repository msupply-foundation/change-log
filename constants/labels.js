const { OUTPUT, groupTitleChangeLog } = require('./logs');

const LABEL_GROUPS = {
    CUSTOMER: 'Customer',
    BUG: 'Bug',
    FEATURE: 'Feature'
};

const LABEL_TYPES_BUG = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development'
}

const LABEL_TYPES_FEATURE = {
    NEW: 'new',
    EXISTING: 'existing'
}

const parseLabel = label => {
  if (!label) return { group: null, type: null };
  const [group = '', type= ''] = label.split(';');
  return {
    group: group.trimRight(),
    type: type.trimLeft(),
  };
}

function getTitle (label) {
    const { group, type } = parseLabel(label);

    switch(group) {
        case LABEL_GROUPS.FEATURE:
            switch (type) {
                case LABEL_TYPES_FEATURE.EXISTING:
                    return OUTPUT.IMPROVEMENTS_TITLE;
                case LABEL_TYPES_FEATURE.NEW:
                    return OUTPUT.FEATURES_TITLE;
            }
        case LABEL_GROUPS.BUG:
            switch (type) {
                case LABEL_TYPES_BUG.PRODUCTION:
                    return OUTPUT.BUG_FIXES_TITLE;
            }
    }

    // If not returned in one case statement
    return groupTitleChangeLog(group, type);
}

const checkSomeLabelEquals = (labels, prefix, value) => {
    return labels.some(({name}) => name === `${prefix}: ${value}`);
}

function checkSomeLabelHasPrefix(labels, prefix) {
    labels.some(({name}) => {
        const { group } = parseLabel(name);
        group === prefix
    });
}

module.exports = {
    LABEL_GROUPS,
    getTitle,
    checkSomeLabelEquals,
    checkSomeLabelHasPrefix
}
