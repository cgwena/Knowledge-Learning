<template>
  <div class="theme-card">
    <h2>{{ theme.title }}</h2>
    <p>{{ theme.description }}</p>

    <!-- Liste des cursus associés -->
    <div v-if="theme.cursus && theme.cursus.length > 0">
      <CursusCard
        v-for="cursus in theme.cursus"
        :key="cursus.id"
        :cursus="cursus"
      />
    </div>
    <p v-else>Pas de cursus associés à ce thème.</p>
  </div>
</template>

<script>
import CursusCard from "./CursusCard.vue";

export default {
  name: "ThemeCard",
  props: {
    theme: {
      type: Object,
      required: true,
    },
  },
  components: {
    CursusCard,
  },
};
</script>

<style scoped>
.theme-card {
  border: 1px solid var(--color2);
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: var(--color1);
}

</style>
