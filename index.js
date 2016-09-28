const {
  Task
} = require('./libs');

const {
  INTERVAL
} = require('./contants');


const { startServer } = require("./server");
const { init, update } = require('./filesystem');
const { observe } = require('./watcher');

startServer();

const boot = Task.async(function*() {
  yield init();
  observe();
  setTimeout(function() { setInterval(update, INTERVAL); }, 0);

});

boot();
