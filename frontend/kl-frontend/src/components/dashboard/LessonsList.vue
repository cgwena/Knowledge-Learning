<template>
  <div class="lesson-list">
    <ul v-if="lessons && lessons.length > 0">
      <li v-for="lesson in lessons" :key="lesson._id">
        {{ lesson.title }}
        {{ lesson.id}}
        <ActionButton
          class="button"
          btnColor="secondary"
          textContent="Voir la leçon"
          @click="goToLesson(lesson._id)"
        />
      </li>
    </ul>
    <p v-else>Pas de leçons disponibles pour ce cursus.</p>
  </div>
</template>

<script>
import ActionButton from "@/components/ActionButton.vue";

export default {
  name: "LessonsList",
  components: {
    ActionButton,
  },
  props: {
    lessons: {
      type: Array,
      required: true,
    },
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
  margin-left: 16px;
  display: flex;
  text-align: left;
}
.lesson-list ul {
  padding-left: 20px;
}

li {
  list-style: none;
  color: var(--color4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  width: 130%;
}
</style>
