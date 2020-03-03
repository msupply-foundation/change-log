
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
                    return `\n\n## Improvements`;
                case LABEL_TYPES_FEATURE.NEW:
                    return `\n\n## New Features`;
                default:
                    return `\n\n## ${group}:${type} - No title preset`;
            }
        case LABEL_GROUPS.BUG:
            switch (type) {
                case LABEL_TYPES_BUG.PRODUCTION:
                    return `\n\n## Bug fixes`;
                default:
                    return `\n\n## ${group}:${type} - No title preset`;
            }
        default:
            return `\n\n## ${group} - No title preset`;
    }
}

function checkSomeLabelEquals(labels, prefix, value) {
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
