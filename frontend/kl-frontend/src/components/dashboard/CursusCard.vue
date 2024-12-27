<template>
  <div class="cursus-card">
    <h3>{{ cursus.title }}</h3>
    <LessonsList :lessons="cursus.lessons" />
  </div>
</template>

<script>
import LessonsList from "@/components/dashboard/LessonsList.vue";

export default {
  name: "CursusCard",
  props: {
    cursus: Object,
  },
  components: {
    LessonsList,
  },
};
</script>

<style scoped>
.cursus-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
}
</style>
