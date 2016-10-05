const { glob, Task, watch, fs } = require('./libs');

const { WATCH_FILE_PATTERN, DEBUGGER_DEVTOOLS_ROOT,
  WATCH_ROOT, MC_ROOT, DEBUGGER_ROOT, INTERVAL, GITHUB_USERNAME
} = require('./contants');

const { log } = require('./server');
const { execute } = require('./filesystem');
const { github } = require('./auth');

const watchOptions = {
  // ignoreDotFiles: true,
  // interval,
  ignoreUnreadableDir: true,
  ignoreNotPermitted: true,
  // filter
};

const commitCommand = `cd ${DEBUGGER_ROOT} &&  git commit -m "Tracking changes from m-c/DevTools on ${new Date().toISOString().slice(0, 10)}" && git push origin --force && cd ..`;
const fileQueue = [];

const observe = Task.async(function*() {
    const watchFiles = yield new Promise(function (resolve, reject) {
      glob(WATCH_FILE_PATTERN, null, function (er, files) {
        resolve(files.map(function (file) {
          const watchFile = file.replace(DEBUGGER_DEVTOOLS_ROOT, WATCH_ROOT);
          try {
            const fileText = fs.readFileSync(watchFile, 'utf8');
            log(watchFile + " -> " + file);
            fs.writeFileSync(file, fileText);
            fileQueue.push(file);
          } catch (e) {
            log("error: " + e);
          }
          return watchFile;
        }));
      });
    });
    log('Files in ' + DEBUGGER_DEVTOOLS_ROOT + " now tracked in " + MC_ROOT);
    log("Watching files: ", watchFiles);
    setTimeout(function() { setInterval(modify, INTERVAL); }, 1000*60*.5);
    start(watchFiles);
});

const start = Task.async(function*(watchFiles) {
  watch.createMonitor(WATCH_ROOT, watchOptions, function(monitor) {
    log("Watching " + MC_ROOT + " for changes.");
    // monitor.files['/home/.zshrc'] // Stat object for my zshrc.
    monitor.on("created", function (file, stat) {
      // Handle new files
      log("New file created in " + MC_ROOT + " for DevTools : " + file + "; ignoring.");
    });
    monitor.on("changed", function (file, curr, prev) {
      // Handle file changes
      log("file changed: ", file);
      if (watchFiles.indexOf(file) != -1) {
        const newFile = file.replace(WATCH_ROOT, DEBUGGER_DEVTOOLS_ROOT);
        log(file + " -> " + newFile);
        const fileText = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(newFile, fileText);
        fileQueue.push(newFile);
      }
    });
    monitor.on("removed", function (file, stat) {
      // Handle removed files
      log("File removed in " + MC_ROOT + " for DevTools : " + file + "; ignoring.");
    });
    // monitor.stop(); // Stop watching
  });
});

const modify = Task.async(function*() {
  log('Checking to see if PR is appropriate');
  log('New files since last PR: ' + fileQueue.length);
  if (fileQueue.length) {
    let message = "_AUTOMATED PULL REQUEST VIA BOT_\n";
    log("Updating Git Repo: " + DEBUGGER_ROOT);
    while(fileQueue.length) {
      const file = fileQueue.pop();
      const addCommand = `cd ${DEBUGGER_ROOT} && git add ${file.replace(DEBUGGER_ROOT, "")} && cd ..`;
      log("Adding " + file + " to Git.");
      message += " - **M** " + file + "\n";
      yield execute(addCommand);
    }
    log("Commiting Changes in " + DEBUGGER_ROOT);
    yield execute(commitCommand);
    log("Sending pull request to GitHub.");
    setInterval(function() {
      github.pullRequests.create({
        user: 'devtools-html',
        repo: 'debugger.html',
        title: "Tracking changes in MC",
        head:  GITHUB_USERNAME + ':mc-tracking',
        base: 'master',
        body: message
      });
    }, 2000);
  }
});

module.exports = {
  observe,
  modify
};
