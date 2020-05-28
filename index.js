//* Built-in(s)
const fs = require('fs')

//* Javascript Module(s)
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const { base64encode, base64decode } = require('nodejs-base64');
const JSON = {
    parse: require('json-parse'),
    stringify: require('json-stringify')
};

//* Core Package(s)
const core = require('@actions/core');

//* Default Variable(s)
const GITHUB = {
    HOST: 'api.github.com',
    USER: core.getInput('user'),
    TOKEN: core.getInput('token'),
    BRANCH: core.getInput('branch') || 'master',
    REPO: core.getInput('repo'),
    COMMIT: {
        message: core.getInput('message'),
        content: core.getInput('content'),
        source: core.getInput('file'),
        destination: core.getInput('dist') || core.getInput('file')
    },
    get CREDENTIAL() {
        if (!this.USER || !this.TOKEN) return '';
        return this.USER + ':' + this.TOKEN + '@';
    },
    get data() {
        let result = {
            message: this.COMMIT.message,
            branch: this.branch,
            content: ''
        };

        if ('sha' in this.COMMIT) {
            result.sha = this.COMMIT.sha;
        }

        result.content = base64encode(result.content);

        return result;
    },
    get source() {
        let [path, branch] = this.COMMIT.source.split('@');
        branch = branch || this.BRANCH;
        return `${path}?ref=${branch}`;
    },
    get destination() {
        let [path, branch] = this.COMMIT.destination.split('@');
        branch = branch || this.BRANCH;
        return `${path}?ref=${branch}`;
    },
    
};

// ...code start here...
let source = `https://${GITHUB.CREDENTIAL}${GITHUB.HOST}/${GITHUB.REPO}/contents/${GITHUB.source}`;
let res = new XMLHttpRequest();
res.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  if (this.status >= 200 && this.status < 300) {
    return resolve(this.status, JSON.parse(this.responseText));
  }
  return reject(this.status, JSON.parse(this.responseText));
};
res.open('GET', source);
res.send();

function resolve(status, data) {
    console.log(status, data);
}

function reject(status, data) {
    console.error(status, data);
}
