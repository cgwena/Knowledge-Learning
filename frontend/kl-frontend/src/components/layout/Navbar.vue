<template>
  <nav>
    <a href="/"><img src="../../assets/Logo_KL.png" alt="Knowledge logo" /></a>
    <ul>
      
      <li><a href="/themes">Nos cours</a></li>
      <li v-if="isAuthenticated">
        <a href="/dashboard">Mon tableau de bord</a>
      </li>
      <li v-else>
        <a href="/login">Se connecter</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color3);
  height: 15vh;
  width: 100vw;
  position: fixed;
  top: 0;
}

img {
  height: 64px;
  border-radius: 16px;
  margin-left: 16px;
}

ul {
  width: 50vw;
  display: flex;
  justify-content: space-evenly;
  background-color: var(--color3);
}

li,
a {
  list-style: none;
  text-decoration: none;
  background-color: var(--color3);
  color: var(--color1);
}

a:hover {
  font-weight: bold;
}
</style>
