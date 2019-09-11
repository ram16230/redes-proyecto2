<template>
  <div class="running">
    <h1>host: {{ host }}</h1>
    <h1>port: {{ port }}</h1>
  </div>
</template>

<script>
import WebSocketServer from 'websocket/lib/WebSocketServer';
import createServer from '../server';

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
    };
  },
  created () {
    this.host = this.$route.params.host;
    this.port = this.$route.params.port;
    this.status = 'loading'

    console.log(this.$http)
    const server = createServer();

    this.wsServer = new WebSocketServer({
      httpServer: server,
    })

    // request connection
    this.wsServer.on('request', function(request){
      this.connection = request.accept(null, request.origin);
      // handlers
      this.connection.on('connect', function(connection) {
        // handle connect
        this.connection = connection;
      });
      this.connection.on('close', function(reason, description) {
        // handle close connection
      });
      this.connection.on('message', function(message) {
        // handle message
      })

    })


  }
};
</script>