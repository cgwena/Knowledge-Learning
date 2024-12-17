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
      <li v-if="isAuthenticated" @click="logout">
          Se déconnecter
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  
  name: "NavBar",
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]), // Vérifie si l'utilisateur est authentifié
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout"); // Appelle l'action de déconnexion
      this.$router.push("/login"); // Redirige vers la page de connexion après déconnexion
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

li:hover {
  font-weight: bold;
  cursor: pointer;
}
</style>
