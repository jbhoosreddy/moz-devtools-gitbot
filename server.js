const { co, http, handler } = require('./libs');
const { PORT } = require('./contants');

const headString =
`<head>
    <style>
        body {
            background-color:black;
            color:white;        
        }
    </style>
</head>`;
let output = '<br />';

const startServer = co.wrap(function*() {
  log('console: starting server');
  http.createServer(function (req, res) {
    res.write(headString+"DevTools GitHub Bot is: Live");
    res.end(output);
    try {
      handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
      })
    } catch (e) {

    }
  }).listen(PORT, function() {
    log(`Server listening on: http://localhost:${PORT}`);
  });
});


// handler.on('error', function (err) {
//   log('Error:', err.message)
// });

handler.on('push', function (event) {
  log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
});

handler.on('issues', function (event) {
  log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
});

handler.on('*', function (event) {
  log('Received an event from' + event.payload.repository.name);
  log(event.payload);
});

function log(...args) {
  console.log(...args);
  args.forEach(function(arg) {
    output += arg + ' ';
  });
  output += '<br />';
}

module.exports = {
  startServer,
  log
};
