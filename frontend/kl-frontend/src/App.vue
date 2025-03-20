<template>
  <div id="app">
    
    <router-view></router-view> 
  </div>
</template>

<script>



export default {
  name: 'KnowledgeLearning',
}
</script>

<style>
:root {
    --color1: #f1f8fc;
    --color2: #0074c7;
    --color3: #00497c;
    --color4: #384050;
    --red1: #cd2c2e;
    --green1: #82b864;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
   background-color: var(--color1);
}

main {
  margin-top: 15vh;
}
</style>