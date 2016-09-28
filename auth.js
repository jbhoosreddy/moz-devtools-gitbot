const GitHubApi = require("github");
const { log } = require('./server');
const { CLIENT_ID, CLIENT_SECRET } = require('./contants');

log('Setting up GitHub API service.');
const github = new GitHubApi({
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
  headers: {
    "user-agent": "moz-devtools-gitbot" // GitHub is happy with a unique user agent
  },
  Promise: require('bluebird'),
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

log('Authenticating Bot.');
github.authenticate({
  type: "oauth",
  key: CLIENT_ID,
  secret: CLIENT_SECRET
  // username: '',
  // password: ''
});

log('Exporting GitHub to Bot.');
module.exports = {
  github
};