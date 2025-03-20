<template>
  <div class="cursus-card">
    <template v-if="isEditing">
      <form @submit.prevent="saveCursus">
        <input v-model="editedCursus.title" placeholder="Titre du cursus" />
        <button type="submit">Enregistrer</button>
        <button type="button" @click="cancelEdit">Annuler</button>
      </form>
    </template>
    <template v-else>
      <h6>{{ cursus.title }}</h6>
      <button @click="startEdit">Modifier</button>
      <button @click="deleteCursus(cursus._id)">Supprimer</button>
    </template>

    <div v-if="cursus.lessons && cursus.lessons.length > 0">
      <AdminLessonList
        :lessons="cursus.lessons"
        @editLesson="editLesson"
        @deleteLesson="deleteLesson"
      />
    </div>

    <!-- Button to add a new lesson -->
    <button @click="openAddLessonForm">Ajouter une leçon</button>

    <!-- Form to add a new lesson -->
    <div v-if="isAddingLesson" class="add-lesson-form">
      <form @submit.prevent="submitNewLesson">
        <input
          v-model="newLesson.title"
          type="text"
          placeholder="Titre de la leçon"
        />
        <input
          v-model.number="newLesson.price"
          type="number"
          placeholder="Prix de la leçon"
        />
        <input
          v-model="newLesson.text"
          type="text"
          placeholder="Texte de la leçon"
        />
        <button type="submit">Ajouter</button>
        <button type="button" @click="cancelAddLesson">Annuler</button>
      </form>
    </div>
  </div>
</template>

<script>
import AdminLessonList from "./AdminLessonList.vue";

export default {
  props: {
    cursus: Object,
  },
  components: {
    AdminLessonList,
  },
  data() {
    return {
      isEditing: false,
      isAddingLesson: false,
      editedCursus: { ...this.cursus },
      newLesson: {
        title: "",
        price: 0,
        text: ""
      }
    };
  },
  methods: {
    startEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedCursus = { ...this.cursus };
    },
    saveCursus() {
      this.$emit("editCursus", this.editedCursus);
      this.isEditing = false;
    },
    deleteCursus(cursusId) {
      this.$emit("deleteCursus", cursusId);
    },
    editLesson(lesson) {
      this.$emit("editLesson", lesson);
    },
    deleteLesson(lessonId) {
      this.$emit("deleteLesson", lessonId);
    },
    openAddLessonForm() {
      this.isAddingLesson = true;
      this.newLesson = { title: "", price: 0, text: "" };
    },
    cancelAddLesson() {
      this.isAddingLesson = false;
      this.newLesson = { title: "", price: 0, text: "" };
    },
    submitNewLesson() {
      if (!this.newLesson.title || this.newLesson.price <= 0 || !this.newLesson.text) {
        alert("Please fill in all fields");
        return;
      }

      const newLessonData = {
        ...this.newLesson,
        cursusId: this.cursus._id
      };

      // Emit the event to add the new lesson
      this.$emit('addNewLesson', newLessonData);

      // Reinitialize the form
      this.isAddingLesson = false;
      this.newLesson = { title: "", price: 0, text: "" };
    }
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
  color: var(--color1);
  font-size: 1.6rem;
}

input {
  width: 100%;
  max-width: 500px;
  padding: 10px; 
  font-size: 1rem; 
  box-sizing: border-box;
}

button {
  margin: 0 10px;
}
</style>
