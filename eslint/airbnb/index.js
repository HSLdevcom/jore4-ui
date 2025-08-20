module.exports = {
  rules: {
    ...require('./best-practices').rules,
    ...require('./errors').rules,
    ...require('./node').rules,
    ...require('./style').rules,
    ...require('./variables').rules,
    ...require('./es6').rules,
    ...require('./imports').rules,
    ...require('./strict').rules,
    ...require('./react').rules,
    ...require('./react-a11y').rules,
    ...require('./react-hooks').rules,
  },
};
