<template>
  <div class="cursus-card">
    <h3>{{ cursus.title }} ({{ cursus.price }} €)</h3>

    <!-- Liste des leçons associées -->
    <LessonList :lessons="cursus.lessons" />
    <ActionButton
      class="button"
      btnColor="primary"
      textContent="Acheter le cursus complet"
    />
  </div>
</template>

<script>
import ActionButton from "../ActionButton.vue";
import LessonList from "./LessonsList.vue";

export default {
  name: "CursusCard",
  props: {
    cursus: {
      type: Object,
      required: true,
    },
  },
  components: {
    LessonList,
    ActionButton,
  },
};
</script>

<style scoped>
.cursus-card {
  position: relative;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--color3);
  border-radius: 8px;
  background: var(--color2);
}

.button {
  position: absolute;
  bottom: 4px;
  right: 8px;
}

h3 {
  color: var(--color1);
}
</style>
