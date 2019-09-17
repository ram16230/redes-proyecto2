<template>
  <div class="running" style="display: flex">
    <div class="ui">
      <div class="system">
        <p>name: {{ name }}</p>
        <p>host: {{ host }}</p>
        <p>port: {{ port }}</p>
        <p>room: {{ room }}</p>
        <p>sum: {{ sum }} </p>
        <p>turno: {{ myTurn }} </p>
      </div>
      <div class="game">
        <h3> Sum </h3>
        <h1 class="sum"> {{ sum }} </h1>
      </div>
      <div class="chat">
        <div class="scrollable">
          <p
            v-for="msg in messages"
            v-bind:key="msg"
          >
            <b>{{ msg.from }}:</b> {{ msg.body }}
          </p>
        </div>
        <div class="message">
          <input v-model="msg" placeholder="message">
          <button v-on:click="sendMessage(msg)">SEND</button>
        </div>
      </div>
    </div>
    <div class="hand">
      <button
        class="card"
        v-for="card in hand"
        v-bind:key="card"
        v-on:click="selectCard(card)"
      >
        {{ card }}
      </button>
    </div>
  </div>
</template>

<script>
import WebSocketServer from 'websocket/lib/WebSocketServer';
import uuid from 'uuid/v4';

export default {
  name: "running",
  props: {

  },
  methods: {
    selectCard: function(card) {
      if (this.myTurn) {
        this.hand.splice(this.hand.indexOf(card), 1);
        this.wsServer.send(JSON.stringify({
          action: 'make_move',
          id: this.self,
          card,
        }));
        this.myTurn = false;
      }
    },
    sendMessage: function() {
      this.wsServer.send(JSON.stringify({
        action: 'send',
        id: this.self,
        body: this.msg,
      }));
      this.msg = '';
    }
  },
  data: () => ({
    host: '',
    port: '',
    room: '',
    name: '',
    myTurn: false,
    status: 'off',
    wsServer: undefined,
    connection: undefined,
    self: undefined,
    hand: [],
    sum: 0,
    messages: [],
    msg: '',
  }),
  created () {
    this.host = this.$route.params.host;
    this.port = this.$route.params.port;
    this.room = this.$route.params.room;
    this.name = this.$route.params.name;
    console.log(this.$route.params.room, this.room);
    this.status = 'loading'

    let socket = new WebSocket("ws://" + this.host + ":" + this.port);
    this.wsServer = socket;

    socket.onopen = (e) => {
      
    };

    socket.onmessage = (message) => {
      console.log(message.data);
      let msg = JSON.parse(message.data);
      switch (msg.action) {

        case 'connected': {
          this.self = msg.id;
          this.hand = [0,0,1,2]
          // new or join room
          if (this.room == '') {
            // new room
            console.log('new room')
            socket.send(JSON.stringify({
              action: 'newRoom',
              id: this.self,
              name: this.name,
            }));
          }
          else {
            // join room
            socket.send(JSON.stringify({
              action: 'joinRoom',
              id: this.self,
              room: this.room,
              name: this.name,
            }));
          }
          break;
        }
        case 'joinRoom': {
          this.room = msg.room;
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
        case 'update': {
          this.sum = msg.sum;
          break;
        }
        case 'ready': {
          this.myTurn = true;
          break;
        }
        case 'change': {
          this.sum = msg.sum;
          break;
        }
        case 'lose': {
          // perdio
          alert("You lose, pls go back to keep playing")
          break;
        }
        case 'win': {
          // gano
          alert("You Win, pls go back to keep playing")
          break;
        }
        case 'message': {
          this.messages = [...this.messages, {
            from: msg.from,
            body: msg.body,
          }]
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

<style scoped lang="scss">
.running {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.ui {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 400px;

}
.system {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  min-width: 150px;
  padding-top: 5rem;

}
.system * {
  margin: 0;
}
.game {
  display: flex;
  flex-direction: column;
  width: 60%;
  align-items: center;
}
.chat {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  min-width: 150px;
}
.scrollable {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 300px;
}
.sum {
  display: flex;
  width: max-content;
  font-size: 100pt;
  margin: 0;
}
.card {
  border: 0;
  margin: 0 0.5rem;
  width: 100px;
  height: 140px;
  font-size: 32px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.31);
  background-color: whitesmoke;
}
</style>