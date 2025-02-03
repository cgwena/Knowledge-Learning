<template>
  <div class="theme-card">
    <template v-if="isEditing">
      <form @submit.prevent="saveTheme">
        <input v-model="editedTheme.title" placeholder="Titre du thème" />
        <button type="submit">Enregistrer</button>
        <button type="button" @click="cancelEdit">Annuler</button>
      </form>
    </template>
    <template v-else>
      <h4>{{ theme.title }}</h4>
      <button @click="startEdit">Modifier</button>
      <button @click="deleteTheme(theme._id)">Supprimer</button>
    </template>

    <div v-if="theme.cursus && theme.cursus.length > 0">
      <AdminCursusCard
        v-for="cursus in theme.cursus"
        :key="cursus.id"
        :cursus="cursus"
        @editCursus="editCursus"
        @deleteCursus="deleteCursus"
        @editLesson="editLesson"
        @deleteLesson="deleteLesson"
        @addNewLesson="addNewLesson"
      />
    </div>

    <!-- Bouton pour ajouter un cursus -->
    <button @click="openAddCursusForm">Ajouter un cursus</button>

    <!-- Formulaire pour ajouter un cursus -->
    <div v-if="isAddingCursus" class="add-cursus-form">
      <form @submit.prevent="submitNewCursus">
        <input
          v-model="newCursus.title"
          type="text"
          placeholder="Titre du cursus"
        />
        <input
          v-model.number="newCursus.price"
          type="number"
          placeholder="Prix du cursus"
        />
        <button type="submit">Ajouter</button>
        <button type="button" @click="cancelAddCursus">Annuler</button>
      </form>
    </div>
  </div>
</template>

<script>
import AdminCursusCard from './AdminCursusCard.vue';

export default {
  props: {
    theme: Object
  },
  components: {
    AdminCursusCard
  },
  data() {
    return {
      isEditing: false,
      isAddingCursus: false,
      editedTheme: { ...this.theme },
      newCursus: {
        title: "",
        price: 0
      }
    };
  },
  methods: {
    startEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedTheme = { ...this.theme };
    },
    saveTheme() {
      this.$emit('editTheme', this.editedTheme);
      this.isEditing = false;
    },
    deleteTheme(themeId) {
      this.$emit('deleteTheme', themeId);
    },
    editCursus(cursus) {
      this.$emit('editCursus', cursus);
    },
    deleteCursus(cursusId) {
      this.$emit('deleteCursus', cursusId);
    },
    editLesson(lesson) {
      this.$emit('editLesson', lesson);
    },
    deleteLesson(lesson) {
      this.$emit('deleteLesson', lesson)
    },
    addNewLesson(lesson) {
      this.$emit('addNewLesson', lesson)
    },
    openAddCursusForm() {
      this.isAddingCursus = true;
      this.newCursus = { title: "", price: 0 };
    },
    cancelAddCursus() {
      this.isAddingCursus = false;
      this.newCursus = { title: "", price: 0 };
    },
    submitNewCursus() {
      if (!this.newCursus.title || this.newCursus.price <= 0) {
        alert("Veuillez renseigner un titre et un prix valide pour le cursus.");
        return;
      }

      const newCursusData = {
        ...this.newCursus,
        themeId: this.theme._id
      };

      // Émettre un événement pour le parent avec les données du nouveau cursus
      this.$emit('addNewCursus', newCursusData);

      // Réinitialiser le formulaire
      this.isAddingCursus = false;
      this.newCursus = { title: "", price: 0 };
    }
  }
};
</script>


<style scoped>
.theme-card {
  border: 1px solid var(--color2);
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: var(--color1);
  font-size: 1.8rem;
}
button {
  margin: 10px;
}
</style>
