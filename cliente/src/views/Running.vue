<template>
  <div class="running">
    <h1>host: {{ host }}</h1>
    <h1>port: {{ port }}</h1>
    <h1>room: {{ room }}</h1>
  </div>
</template>

<script>
import WebSocketServer from 'websocket/lib/WebSocketServer';
import uuid from 'uuid/v4';

export default {
  name: "running",
  props: {

  },
  data: () => ({
    host: '',
    port: '',
    room: '',
    status: 'off',
    wsServer: undefined,
    connection: undefined,
    self: undefined,
    hand: [],
    sum: 0,
  }),
  created () {
    this.host = this.$route.params.host;
    this.port = this.$route.params.port;
    this.room = this.$route.params.room;
    console.log(this.$route.params.room, this.room);
    this.status = 'loading'

    let socket = new WebSocket("ws://" + this.host + ":" + this.port);

    socket.onopen = (e) => {
      
    };

    socket.onmessage = (message) => {
      console.log(message.data);
      let msg = JSON.parse(message.data);
      switch (msg.action) {

        case 'connected': {
          this.self = msg.id;
          // new or join room
          console.log(this.room)
          if (this.room == undefined) {
            // new room
            console.log('new room')
            socket.send(JSON.stringify({
              action: 'newRoom',
              id: this.self,
            }));
          }
          else {
            // join room
            socket.send(JSON.stringify({
              action: 'joinRoom',
              id: this.self,
              room: this.room,
            }));
          }
          break;
        }
        case 'joinRoom': {
          this.room = msg.room;
          alert(this.room);
          break;
        }
        case 'recieved': {
          // get new card
          this.hand.push(msg.card);
          break;
        }
        case 'start': {
          this.hand = msg.hand;
          // pass card
            // delete card
          break;
        }
        case 'ready': {
          this.sum = msg.sum;
          // make your move
          // make math
          break;
        }
        case 'change': {
          this.sum = msg.sum;
          break;
        }
        case 'lose': {
          // perdio
          break;
        }
        case 'win': {
          // gano
          break;
        }
        
      
        default:
          break;
      }
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
      }
    };

    socket.onerror = (error) => {
      alert(`[error] ${error.message}`);
    };
  }
};
</script>