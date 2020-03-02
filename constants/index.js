const { PREFIXES, getTitle, checkSomeLabelEquals, checkSomeLabelHasPrefix } = require('./labels');
const { logs } = require('./logs');
const { textPath } = requires('./path');

module.exports = {
  PREFIXES,
  logs,
  textPath,
  getTitle,
  checkSomeLabelEquals,
  checkSomeLabelHasPrefix
};
