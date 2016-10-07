const MC_ROOT = "mozilla-central/";
const WATCH_ROOT = MC_ROOT + "devtools/";
const DEBUGGER_ROOT = "debugger.html/";
const DEBUGGER_DEVTOOLS_ROOT = DEBUGGER_ROOT + "public/js/lib/devtools/";
const WATCH_FILE_PATTERN = DEBUGGER_DEVTOOLS_ROOT + '**/*.*';
const INTERVAL = 1000*60*60;
const PORT = process.env.PORT || 8080;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'jbhoosreddy';

module.exports = {
  MC_ROOT,
  WATCH_ROOT,
  DEBUGGER_ROOT,
  DEBUGGER_DEVTOOLS_ROOT,
  WATCH_FILE_PATTERN,
  INTERVAL,
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  GITHUB_USERNAME
};
