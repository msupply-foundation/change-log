
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

const getPrefix = (label) => (label || '').split(':')[0].trimRight();

function getType (label) {
    const labelType = (label || '').split(':');
    return (labelType.length > 1) ? labelType[1].trimLeft() : '';
}

function getTitle (label) {
    const prefix = getPrefix(label);
    const type = getType(label);

    switch(prefix) {
        case LABEL_GROUPS.FEATURE:
            switch (type) {
                case featureTypes.EXISTING:
                    return `\n\n## Improvements`;
                case featureTypes.NEW:
                    return `\n\n## New Features`;
                default:
                    return `\n\n## ${prefix}:${type} - No title preset`;
            }
        case LABEL_GROUPS.BUG:
            switch (type) {
                case LABEL_TYPES_BUG.PRODUCTION:
                    return `\n\n## Bug fixes`;
                default:
                    return `\n\n## ${prefix}:${type} - No title preset`;
            }
        default:
            return `\n\n## ${prefix} - No title preset`;
    }
}

function checkSomeLabelEquals(labels, prefix, value) {
    return labels.some(({name}) => name === `${prefix}: ${value}`);
}

function checkSomeLabelHasPrefix(labels, prefix) {
    labels.some(({name}) => getPrefix(name) === prefix);
}

module.exports = {
    LABEL_GROUPS,
    getTitle,
    checkSomeLabelEquals,
    checkSomeLabelHasPrefix
}
