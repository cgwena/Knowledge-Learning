<template>
  <div class="lesson-list">
    <ul v-if="lessons && lessons.length > 0">
      <li v-for="lesson in lessons" :key="lesson.id">
        {{ lesson.title }} ({{ lesson.price }} €)
        <ActionButton
          class="button"
          btnColor="primary"
          textContent="Acheter le cours"
          @click="handleAddToCart(lesson)" />
      </li>
    </ul>
    <p v-else>Pas de leçons disponibles pour ce cursus.</p>
  </div>
</template>

<script>
import ActionButton from "../ActionButton.vue";

export default {
  name: "LessonList",
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
    handleAddToCart(lesson) {
      this.$emit("add-to-cart", lesson);
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
  color: var(--color1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  width: 130%;
}
</style>
