<template>
  <div class="cursus-card">
    <h3>{{ cursus.data.title }}</h3>
    <div class="certified" v-if="cursus.isCompleted">Cursus Complété</div>
    <LessonsList :lessons="cursus.data.lessons" />
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
  position: relative;
}

.certified {
    border: 1px solid var(--green1);
    border-radius: 5px;
    padding: 5px;
    background-color: var(--green1);
    color: var(--color1);
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
