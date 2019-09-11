<template>
  <div class="login">
    <h1>Initiate your server!</h1>

    <div class="row">
      <span> Host: </span>
      <input v-model="host" placeholder="host ip">
    </div>
    <div class="row">
      <span> Port: </span>
      <input v-model="port" placeholder="port">
    </div>

    <div class="row">
      <router-link :to="{
        name: 'running',
        params: {
          host,
          port,
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
    props: {
      host: '',
      port: '',
    },
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