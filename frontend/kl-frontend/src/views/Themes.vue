<template>
  <div class="themes-page">
    <h1>Les Thèmes des Leçons</h1>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="themes.length === 0" class="loading">
      <p>Chargement des thèmes...</p>
    </div>

    <div v-else>
      <ul>
        <li v-for="theme in themes" :key="theme.id">
          <h2>{{ theme.title }}</h2>
          <p>{{ theme.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getThemes } from "@/services/lesson.service.js";

export default {
  name: "ThemesPage",
  data() {
    return {
      themes: [], // Liste des thèmes récupérés
      error: null, // Pour afficher les erreurs
    };
  },
  async created() {
    try {
      this.themes = await getThemes(); // Appel du service pour récupérer les thèmes
    } catch (err) {
      this.error = "Une erreur est survenue lors du chargement des thèmes.";
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
};
</script>

<style scoped>
.themes-page {
  padding: 20px;
}

.error {
  color: red;
}

.loading {
  color: gray;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}
</style>
