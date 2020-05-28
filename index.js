// index.js
const core = require('@actions/core');
const { base64encode, base64decode } = require('nodejs-base64');

const GITHUB = {
    USER: core.getInput('user'),
    TOKEN: core.getInput('token'),
    BRANCH: core.getInput('branch'),
    REPO: core.getInput('repo'),
    COMMIT: {
        message: core.getInput('message'),
        content: core.getInput('content'),
        source: core.getInput('file'),
        destination: core.getInput('dist') || core.getInput('file')
    },
    get CREDENTIAL() {
        return `https://${this.USER}:${this.TOKEN}@api.github.com/contents/${this.REPO}`;
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
        typeof branch === 'undefined' && (branch = this.BRANCH);
        return `${this.CREDENTIAL}/${path}?ref=${branch}`;
    },
    get destination() {
        let [path, branch] = this.COMMIT.destination.split('@');
        typeof branch === 'undefined' && (branch = this.BRANCH);
        return `${this.CREDENTIAL}/${path}?ref=${branch}`;
    }
};

console.log([
  GITHUB.CREDENTIAL,
  GITHUB.source, GITHUB.destination, GITHUB.data
]);
