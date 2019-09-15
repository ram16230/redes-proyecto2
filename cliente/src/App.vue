<template>
  <div id="app">
    <div id="wrapper">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
body {
  height: 100vh;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  background: #c5cbe3;
  height: 100%;
}

#wrapper {
  display: flex;
  width: 75vw;
}
</style>
