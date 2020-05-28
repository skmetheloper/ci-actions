import core from '@actions/core';

console.info([
  core.getInputs('user'),
  core.getInputs('token'),
  core.getInputs('message'),
  core.getInputs('content'),
  core.getInputs('branch'),
  core.getInputs('file'),
  core.getInputs('dist')
]);
