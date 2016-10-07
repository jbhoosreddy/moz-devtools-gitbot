const { Task, exec } = require('./libs');
const { MC_ROOT, DEBUGGER_ROOT } = require('./contants');
const { log } = require('./server');
const INIT_COMMAND = `cd ${DEBUGGER_ROOT} && git checkout mc-tracking && cd ..`;
const UPDATE_COMMAND = `cd ${MC_ROOT} && hg pull -u && cd .. && cd ${DEBUGGER_ROOT} && git fetch upstream master && git reset --hard upstream/master
 && cd ..`;

const init = Task.async(function*() {
  log('Initializing file system.');
  log("Switching for tracking branch: ");
  return execute(INIT_COMMAND);
});

const update = Task.async(function*() {
  log('Updating file system.');
   return execute(UPDATE_COMMAND);
});

const execute = Task.async(function*(command) {
  log(command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stderr, stdout) => {
      !stdout || log("stdout: " + stdout);
      !stderr || log("stderr: " + stderr);
      !error || log("error: " + error);
      resolve(null);
    });
  });
});

module.exports = {
  init,
  update,
  execute
};
