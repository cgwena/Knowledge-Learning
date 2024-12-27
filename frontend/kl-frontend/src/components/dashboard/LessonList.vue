<template>
  <div class="lesson-list">
    <h3>{{ lesson.title }}</h3>
    <ActionButton
      class="button"
      btnColor="secondary"
      textContent="Voir la leçon"
      @click="goToLesson(lesson._id)"
    />
  </div>
</template>

<script>
import ActionButton from "@/components/ActionButton.vue";

export default {
  name: "LessonList",
  components: {
    ActionButton,
  },
  props: {
    lesson: Object,
  },
  methods: {
    goToLesson(id) {
      this.$router.push(`/lesson/${id}`);
    },
  },
};
</script>

<style scoped>
.lesson-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
}
</style>
