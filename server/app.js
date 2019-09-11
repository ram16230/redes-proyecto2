let WebSocketServer = require('websocket').server;
let http = require('http');

const PORT = 1337;

// state
let players = {
  /*[id]: {
    connection,
    room,
    hand,
  } */
};
let rooms = [];
let turn = -1;


let server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(PORT, () => {
  console.log('Server Listening ' + PORT);
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', (request) => {
  let connection = request.accept(null, request.origin);
  console.log(connection);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', (message) => {
    console.log(message)
  });

  connection.on('close', (connection) => {
    // close user connection
  });
});