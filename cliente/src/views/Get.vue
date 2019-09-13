<template>
  <div class="running">
    <h1> GET </h1>
  </div>
</template>

<script>
import WebSocketServer from 'websocket/lib/WebSocketServer';
export default {
  created() {
    let socket = new WebSocket("ws://localhost:1337");

    socket.onopen = (e) => {
    };

    socket.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      console.log(msg);
      switch (msg.action) {
        case 'connected':
          this.self = msg.id;
          socket.send(JSON.stringify({
            action: 'get',
            id: this.self,
          }))
          break;
      }

    }
  }
}
</script>