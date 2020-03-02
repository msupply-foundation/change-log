const { TEXT_PATH } = requires('./path');
const { PREFIXES } = require('./labels');
const { getTitle, checkSomeLabelEquals, checkSomeLabelHasPrefix } = require('./labels');
const { logs } = require('./logs');

module.exports = {
  PREFIXES,
  TEXT_PATH,
  logs,
  getTitle,
  checkSomeLabelEquals,
  checkSomeLabelHasPrefix
};
