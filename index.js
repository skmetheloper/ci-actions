//* Built-in(s)
const fs = require('fs');
const http = require('http');

//* Node Module(s)
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
        return `${this.USER}:${this.TOKEN}@api.github.com`;
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
        return `/${this.REPO}/contents/${path}?ref=${branch}`;
    },
    get destination() {
        let [path, branch] = this.COMMIT.destination.split('@');
        branch = branch || this.BRANCH;
        return `/${this.REPO}/contents/${path}?ref=${branch}`;
    },
    
};

// ...code start here...
let response = http.get({
    auth: GITHUB.CREDENTIAL,
    host: GITHUB.HOST,
    path: GITHUB.source,
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json'
    }
}, resolve);

function resolve(res) {
    console.log(res);
}

response.send();
response.end();

