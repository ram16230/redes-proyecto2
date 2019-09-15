<template>
  <div class="login">
    <h1>Initiate your server!</h1>

    <div class="row">
      <span> Name: </span>
      <input v-model="name" placeholder="username">
    </div>

    <div class="row">
      <span> Host: </span>
      <input v-model="host" placeholder="host ip">
    </div>

    <div class="row">
      <span> Port: </span>
      <input v-model="port" placeholder="port">
    </div>

    <div class="row">
      <span> New Room: </span>
      <input type="checkbox" id="newRoom" v-model="newRoom">
    </div>

    <div class="row">
      <span> Room: </span>
      <input v-model="room" placeholder="room" :disabled="isDisabled">
    </div>

    <div class="row">
      <router-link :to="{
        name: 'running',
        params: {
          host,
          port,
          room,
          name,
        }
      }" >
        Submit
      </router-link>
    </div>

  </div>
</template>


<script>
  export default {
    name: 'login',
    data: function() {
      return {
        host: 'localhost',
        port: '1337',
        newRoom: false,
        room: '',
        name: '',
      }
    },
    computed: {
      isDisabled: function(){
        return this.newRoom;
      }
    }
  };
</script>

<style scoped lang="scss">
#login {
  display: flex;
  flex-direction: column;
}
#row {
  display: flex;
  flex-direction: row;
}
</style>