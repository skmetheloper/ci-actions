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

        if (fs.dirent.isFile(this.COMMIT.file)) {
            fs.open(this.COMMIT.file, 'r', function(e, fd) { 
                if (e) return console.error(e.code);
                result.content += readMyData(fd);
            });
        }

        result.content = base64encode(result.content);

        if ('sha' in this.COMMIT) {
            result.sha = this.COMMIT.sha;
        }

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

let url = `https://${GITHUB.HOST}/${GITHUB.REPO}/contents/${GITHUB.source}`;
let res = new XMLHttpRequest();
res.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  if (this.status >= 200 && this.status < 300) {
    return resolve(this.status, JSON.parse(this.responseText));
  }
  return reject(this.status, JSON.parse(this.responseText));
};
res.open('GET', url);
res.send();

console.info(url);

function resolve(status, data) {
    if ('commit' in data && 'sha' in data.commit) {
        GITHUB.COMMIT.sha = data.commit.sha;
    }
    console.log(status);
}

function reject(status, data) {
    console.error(status, data);
}

url = `https://${GITHUB.CREDENTIAL}${GITHUB.HOST}/${GITHUB.REPO}/contents/${GITHUB.destination}`;
res = new XMLHttpRequest();
res.open('PUT', url);
res.send(JSON.stringify(GITHUB.data));

console.log(url);
