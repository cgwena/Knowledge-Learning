<template>
  <div class="lesson-list">
    <ul>
      <li v-for="lesson in lessons" :key="lesson.id">
        <template v-if="editingLessonId === lesson._id">
          <form @submit.prevent="saveLesson(lesson._id)">
            <input v-model="editedLesson.title" placeholder="Titre de la leçon" />
            <button type="submit">Enregistrer</button>
            <button type="button" @click="cancelEdit">Annuler</button>
          </form>
        </template>
        <template v-else>
          {{ lesson.title }}
          <button @click="startEdit(lesson)">Modifier</button>
          <button @click="deleteLesson(lesson._id)">Supprimer</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    lessons: Array,
  },
  data() {
    return {
      editingLessonId: null, 
      editedLesson: {},
    };
  },
  methods: {
    startEdit(lesson) {
      this.editingLessonId = lesson._id;
      this.editedLesson = { ...lesson }; // Cloner la leçon pour éviter de modifier l'original
    },
    cancelEdit() {
      this.editingLessonId = null;
      this.editedLesson = {};
    },
    saveLesson(lessonId) {
      this.$emit("editLesson", { ...this.editedLesson, id: lessonId });
      this.editingLessonId = null; // Réinitialiser l'état d'édition
    },
    deleteLesson(lessonId) {
      this.$emit("deleteLesson", lessonId);
    },
  },
};
</script>

<style scoped>
.lesson-list {
  font-size: 1rem;
}

input {
  width: 100%; 
  max-width: 500px;
  padding: 10px; 
  font-size: 1rem; 
  box-sizing: border-box; 
}

button {
  margin: 10px;
}

li {
  list-style: none;
  text-decoration: none;
}
</style>
