const core = require('@actions/core');

let inputs = [
  core.getInput('user'),
  core.getInput('token'),
  core.getInput('message'),
  core.getInput('content'),
  core.getInput('branch'),
  core.getInput('file'),
  core.getInput('dist')
];

core.debug(inputs);
