<template>
  <div class="running">
    <h1>host: {{ host }}</h1>
    <h1>port: {{ port }}</h1>
  </div>
</template>

<script>
import WebSocketServer from 'websocket/lib/WebSocketServer';
import uuid from 'uuid/v4';

export default {
  name: "running",
  props: {

  },
  data() {
    return {
      host: '',
      port: '',
      status: 'off',
      wsServer: undefined,
      connection: undefined,
      self: undefined,
      hand: [],
      sum: 0,
    };
  },
  created () {
    this.host = this.$route.params.host;
    this.port = this.$route.params.port;
    this.status = 'loading'

    let socket = new WebSocket("ws://" + this.host + ":" + this.port);

    socket.onopen = function(e) {
      socket.send("My name is John");
    };

    socket.onmessage = function(message) {
      let msg = JSON.parse(message);
      switch (msg.action) {
        case 'connected':
          this.self = msg.id;
          // new or join room

          break;
        case 'recieved':
          // get new card
          this.hand.push(msg.card);
        case 'start':
          this.hand = msg.hand;
          // pass card
            // delete card
          break;
        case 'your_turn':
          this.sum = msg.sum;
          // make your move
          // make math

          break;
        case 'lose':
          // perdio
          break;
        case 'win':
          // gano
          break;
        
      
        default:
          break;
      }
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
      }
    };

    socket.onerror = function(error) {
      alert(`[error] ${error.message}`);
    };
  }
};
</script>