let WebSocketServer = require('websocket').server;
let http = require('http');
let uuid = require('uuid/v4');
let _ = require('lodash');

const PORT = 1337;

const DECK = [
  ...Array(4).fill(-2),
  ...Array(4).fill(-1),
  ...Array(4).fill(0),
  ...Array(4).fill(1),
  ...Array(4).fill(2),
  ...Array(4).fill(3),
];

// state
let players = {
  /*[id]: {
    id,
    connection,
    room,
    hand,
  } */
};
let rooms = {
  /*[id]: {
    id,
    order: [],
    turn,
    playing,
    sum,
  }*/
};


const startGame = (players, deck) => {
  return ({
    order: _.shuffle(players),
    hands: _.chunk(_.shuffle(deck), 4),
  })
}

const sendToRoom = (room, players, msg) => {
  for (player of room.order) {
    players[player].connection.send(JSON.stringify(msg));
  }
}


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
  let id = uuid();
  // add to player list
  players[id] = {
    id,
    connection,
  }
  connection.send(JSON.stringify({
    action: 'connected',
    id,
  }));

  // Events
  connection.on('message', (message) => {
    // connection
    let msg = JSON.parse(message.utf8Data);
    console.log(msg)
    switch (msg.action) {
      case 'newRoom': {
        let roomNumber = Object.keys(rooms).length;
        rooms[roomNumber] = {
          id: roomNumber,
          order: [msg.id],
          turn: 0,
          playing: false,
          sum: 0,
        }
        players[msg.id].room = roomNumber;
        players[msg.id].name = msg.name;

        players[msg.id].connection.send(JSON.stringify({
          action: 'joinRoom',
          method: 'newRoom',
          room: roomNumber,
        }));

        break;
      }
      case 'joinRoom': {
        let roomNumber = msg.room;
        let values = Object.values(players);

        let playersOnRoom = rooms[roomNumber].order.length;

        if (playersOnRoom < 4) {
          players[msg.id].room = roomNumber;
          players[msg.id].name = msg.name;
          rooms[roomNumber].order.push(msg.id);
          players[msg.id].connection.send(JSON.stringify({
            action: 'joinRoom',
            method: 'joinRoom',
            room: roomNumber,
          }));
        }

        console.log('join', rooms[roomNumber].order)

        playersOnRoom = rooms[roomNumber].order.length;
        if (playersOnRoom === 4) {
          // start game
          const { order, hands } = startGame(rooms[roomNumber].order, DECK);
          rooms[roomNumber].order = order;
          // send hand to all
          for (let i = 0; i < 4; i++) {
            players[order[i]].connection.send(JSON.stringify({
              action: 'start',
              hand: hands[i],
            }));
          }
          // send ready
          const firstPlayer = order[0];
          players[firstPlayer].connection.send(JSON.stringify({
            action: 'ready',
          }));
        }
        break;
      }
      case 'make_move': {
        const p = players[msg.id];
        const order = rooms[p.room].order;
        rooms[p.room].sum += msg.card;

        // broadcast new sum
        for (player of order) {
          players[player].connection.send(JSON.stringify({
            action: 'update',
            sum: rooms[p.room].sum,
          }));
        }

        if (rooms[p.room].sum > 10) {
          // player lose
          rooms[p.room].order.splice(rooms[p.room].order.indexOf(msg.id), 1);
          players[msg.id].connection.send(JSON.stringify({
            action: 'lose',
          }));

          // there is only one ?
          if (rooms[p.room].order.length == 1) {
            players[rooms[p.room].order[0]].connection.send(JSON.stringify({
              action: 'win',
            }));
          }
        }
        let turn = order.findIndex(e => e == msg.id);
        console.log(turn, rooms[p.room].order.length);
        let nextTurn = (turn + 1) % (rooms[p.room].order.length);

        console.log("Siguiente index", nextTurn);
        
        let nextPlayerId = rooms[p.room].order[nextTurn];

        console.log("siguiente id", nextPlayerId);
        console.log(rooms[p.room].order);

        players[nextPlayerId].connection.send(JSON.stringify({
          action: 'ready',
        }));

        break;
      }
      case 'get': {
        console.log(msg);
        players[msg.id].connection.send(JSON.stringify({
          ...rooms,
        }));
        break;
      }
      case 'send': {
        const p = players[msg.id];
        const order = rooms[p.room].order;

        for (player of order) {
          players[player].connection.send(JSON.stringify({
            action: 'message',
            from: p.name,
            body: msg.body,
          }));
        }

      }
    }
  });

  connection.on('close', (connection) => {
    // on close
  });

  connection.on('connection', () => {

  })
});