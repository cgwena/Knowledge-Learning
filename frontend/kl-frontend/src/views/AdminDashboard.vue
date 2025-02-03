<template>
  <div class="admin-dashboard">
    <!-- Gestion des utilisateurs -->
    <div class="user-management">
      <h2>Gestion des utilisateurs</h2>
      <form @submit.prevent="handleUserSubmit">
        <input v-model="userForm.name" placeholder="Nom" required />
        <input v-model="userForm.firstname" placeholder="Prénom" required />
        <input v-model="userForm.email" placeholder="Email" required />
        <input v-model="userForm.password" placeholder="Password" required />
        <input v-model="userForm.role" placeholder="Rôle" required />
        <button type="submit">
          {{ isEditingUser ? "Mettre à jour" : "Ajouter" }} l'utilisateur
        </button>
      </form>
      <div v-if="users.length > 0">
        <h3>Liste des utilisateurs</h3>
        <ul>
          <li v-for="user in users" :key="user.id">
            {{ user.name }} - {{ user.firstname }} - {{ user.email }} -
            {{ user.role }}
            <button @click="editUser(user)">Modifier</button>
            <button @click="deleteUser(user._id)">Supprimer</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Gestion des thèmes -->
    <div class="theme-management">
      <h2>Ajout d'un thème</h2>
      <form @submit.prevent="handleThemeSubmit">
        <!-- Champ pour le thème -->
        <input v-model="themeForm.title" placeholder="Nom du thème" required />

        <!-- Champs pour les cursus -->
        <div
          v-for="(cursus, cursusIndex) in cursusForm.cursus"
          :key="'cursus-' + cursusIndex"
          class="cursus-input"
        >
          <input v-model="cursus.title" placeholder="Nom du cursus" />
          <input v-model="cursus.price" placeholder="Prix du cursus" />
          <button type="button" @click="removeCursus(cursusIndex)">
            Supprimer
          </button>

          <!-- Champs pour les leçons -->
          <div
            v-for="(lesson, lessonIndex) in cursus.lessons"
            :key="'lesson-' + lessonIndex"
            class="lesson-input"
          >
            <input
              v-model="lesson.title"
              :placeholder="'Nom de la leçon ' + (lessonIndex + 1)"
              required
            />
            <input
              v-model="lesson.price"
              :placeholder="'Prix de la leçon ' + (lessonIndex + 1)"
              required
            />
            <input
              v-model="lesson.text"
              :placeholder="'Texte de la leçon ' + (lessonIndex + 1)"
              type="textarea"
            />
            <button
              type="button"
              @click="removeLesson(cursusIndex, lessonIndex)"
            >
              Supprimer
            </button>
          </div>

          <!-- Bouton pour ajouter une nouvelle leçon -->
          <button type="button" @click="addLessonToCursus(cursusIndex)">
            Ajouter une leçon
          </button>
        </div>

        <!-- Bouton pour ajouter un cursus -->
        <button type="button" @click="addCursusToTheme">
          Ajouter un cursus
        </button>

        <!-- Soumission du formulaire -->
        <button type="submit">Ajouter le thème</button>
      </form>

      <div v-if="themes.length > 0">
        <h3>Liste des thèmes</h3>
        <ul>
          <li v-for="theme in themes" :key="theme.id">
            <AdminThemeCard
              :theme="theme"
              @editTheme="editTheme"
              @deleteTheme="deleteTheme"
              @editCursus="editCursus"
              @deleteCursus="deleteCursus"
              @editLesson="editLesson"
              @deleteLesson="deleteLesson"
              @addNewCursus="addNewCursus"
              @addNewLesson="addNewLesson"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AdminThemeCard from "@/components/admin/AdminThemeCard.vue";
import {
  getUsers,
  addUser,
  updateUserInfo,
  deleteUser,
} from "@/services/user.service";
import {
  getThemes,
  fetchThemeById,
  addTheme,
  updateTheme,
  deleteTheme,
  fetchCursusById,
  addCursus,
  updateCursus,
  deleteCursus,
  addLesson,
  updateLesson,
  deleteLesson,
} from "@/services/lesson.service";

export default {
  components: {
    AdminThemeCard,
  },
  data() {
    return {
      users: [],
      themes: [],
      userForm: {
        id: null,
        name: "",
        firstname: "",
        email: "",
        password: "",
        role: "",
      },
      themeForm: { title: "" },
      cursusForm: {
        cursus: [
          {
            title: "",
            price: "",
            lessons: [
              {
                title: "",
                price: "",
                text: "",
              },
            ],
          },
        ],
      },
      isEditingUser: false,
      isEditingTheme: false,
      currentUser: null,
      currentTheme: null,
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchThemes();
    this.loadCurrentUser();
  },
  computed: {
    connectedUser() {
      return this.$store.getters["auth/getUser"];
    },
  },
  methods: {
    loadCurrentUser() {
      const user = localStorage.getItem("currentUser");
      if (user) {
        this.currentUser = JSON.parse(user);
      } else {
        console.warn("Aucun utilisateur trouvé dans le localStorage.");
      }
    },
    // Gestion des utilisateurs
    async fetchUsers() {
      try {
        const response = await getUsers();
        this.users = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    },
    async handleUserSubmit() {
      const cleanUserForm = { ...this.userForm }; // Déstructure les données

      try {
        if (this.isEditingUser) {
          await updateUserInfo(cleanUserForm.id, cleanUserForm);
        } else {
          await addUser(cleanUserForm);
        }
        this.resetUserForm();
        this.fetchUsers();
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi des données :",
          error.response?.data || error.message
        );
      }
    },
    editUser(user) {
      this.isEditingUser = true;
      this.currentUser = user;
      this.userForm = {
        id: user._id,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      };
    },
    async deleteUser(userId) {
      await deleteUser(userId);
      this.fetchUsers();
    },

    // Gestion des thèmes
    async fetchThemes() {
      try {
        const response = await getThemes();
        this.themes = response;
      } catch (error) {
        console.error("Erreur lors de la récupération des thèmes", error);
      }
    },
    addCursusToTheme() {
      this.cursusForm.cursus.push({
        title: "",
        price: "",
        lessons: [
          {
            title: "",
            price: "",
            text: "",
          },
        ],
      });
    },
    removeCursus(index) {
      this.cursusForm.cursus.splice(index, 1);
    },
    addLessonToCursus(cursusIndex) {
      this.cursusForm.cursus[cursusIndex].lessons.push({
        title: "",
        price: "",
      });
    },
    removeLesson(cursusIndex, lessonIndex) {
      this.cursusForm.cursus[cursusIndex].lessons.splice(lessonIndex, 1);
    },
    async handleThemeSubmit() {
      const cursusToAddToTheme = [];
      try {
        // Étape 1 : Enregistrer chaque leçon
        for (const cursus of this.cursusForm.cursus) {
          const lessonsToAddToCursus = [];
          for (const lesson of cursus.lessons) {
            try {
              const response = await addLesson(lesson);
              lessonsToAddToCursus.push(response._id);
            } catch (error) {
              console.error(
                `Erreur lors de l'ajout de la leçon "${lesson.title}" :`,
                error
              );
              throw new Error("Échec de l'enregistrement d'une leçon.");
            }
          }
          try {
            const savedCursus = await addCursus({
              title: cursus.title,
              price: cursus.price,
              lessons: lessonsToAddToCursus, // Récupérer les IDs des leçons
            });
            cursusToAddToTheme.push(savedCursus._id);
          } catch (error) {
            console.error(
              `Erreur lors de l'ajout du cursus "${cursus.title}" :`,
              error
            );
            throw new Error("Échec de l'enregistrement d'un cursus.");
          }
        }

        // Étape 2 : Enregistrer chaque cursus avec les leçons associées

        // Étape 3 : Enregistrer le thème avec les cursus associés
        try {
          await addTheme({
            title: this.themeForm.title,
            cursus: cursusToAddToTheme, // Récupérer les IDs des cursus
          });
        } catch (error) {
          console.error(
            `Erreur lors de l'ajout du thème "${this.themeForm.title}" :`,
            error
          );
          throw new Error("Échec de l'enregistrement du thème.");
        }

        // Réinitialiser le formulaire après la soumission
        this.resetForm();

        // Rafraîchir la liste des thèmes
        await this.fetchThemes();
      } catch (error) {
        console.error("Erreur globale :", error);
      }
    },

    resetForm() {
      // Réinitialisation du formulaire thème
      this.themeForm = {
        title: "",
      };

      // Réinitialisation du formulaire cursus
      this.cursusForm = {
        cursus: [
          {
            title: "",
            price: "",
            lessons: [
              {
                title: "",
                price: "",
              },
            ],
          },
        ],
      };

      // Réinitialisation du formulaire leçon
      this.lessonForm = {
        lessons: [
          {
            title: "",
            price: "",
          },
        ],
      };
    },

    async editTheme(theme) {
      this.isEditingTheme = true;
      this.currentTheme = theme;
      this.themeForm = { title: theme.title };
      await updateTheme(this.currentTheme._id, this.themeForm);
      this.fetchThemes();
    },
    async deleteTheme(themeId) {
      await deleteTheme(themeId);
      this.fetchThemes();
    },

    async handleCursusSubmit() {
      if (this.isEditingCursus) {
        await updateCursus(this.currentCursus._id, this.cursusForm);
      } else {
        await addCursus(this.CursusForm);
      }
      this.resetCursusForm();
      this.fetchThemes();
    },
    async editCursus(cursus) {
      this.isEditingCursus = true;
      this.currentCursus = cursus;
      this.cursusForm = { title: cursus.title };
      await updateCursus(this.currentCursus._id, this.cursusForm);
      this.fetchThemes();
    },
    async deleteCursus(cursusId) {
      await deleteCursus(cursusId);
      this.fetchThemes();
    },

    async handleLessonSubmit() {
      if (this.isEditingLesson) {
        await updateLesson(this.currentLesson.id, this.lessonForm);
      } else {
        await addLesson(this.LessonForm);
      }
      this.resetLessonForm();
      this.fetchThemes();
    },
    async editLesson(lesson) {
      this.isEditingLesson = true;
      this.currentLesson = lesson;
      this.lessonForm = { title: lesson.title };
      await updateLesson(this.currentLesson._id, this.lessonForm);
      this.fetchThemes();
    },
    async deleteLesson(lessonId) {
      await deleteLesson(lessonId);
      this.fetchThemes();
    },
    async addNewCursus(newCursus) {
      const themeId = newCursus.themeId;
      const cursusToAddToTheme = [];

      try {
        const response = await addCursus({
          title: newCursus.title,
          price: newCursus.price, // Récupérer les IDs des cursus
        });
        cursusToAddToTheme.push(response._id);
        const theme = await fetchThemeById(themeId); // Assurez-vous que vous avez une fonction pour obtenir le thème

        // Étape 2: Ajouter le cursus au tableau de cursus existants
        if (!theme.cursus) {
          theme.cursus = []; // Si le tableau de cursus est vide ou non défini
        }

        theme.cursus.push(cursusToAddToTheme);

        // Étape 3: Mettre à jour le thème
        await updateTheme(themeId, theme);
        this.fetchThemes();

      } catch (error) {
        console.error(`Erreur lors de l'ajout du cursus`, error);
        throw new Error("Échec de l'enregistrement du thème.");
      }
    },
    async addNewLesson(newLesson) {
      const cursusId = newLesson.cursusId;
      const lessonToAddToCursus = [];

      try {
        const response = await addLesson({
          title: newLesson.title,
          price: newLesson.price, // Récupérer les IDs des cursus
          text: newLesson.text
        });
        lessonToAddToCursus.push(response._id);
        const cursus = await fetchCursusById(cursusId); // Assurez-vous que vous avez une fonction pour obtenir le thème

        // Étape 2: Ajouter le cursus au tableau de cursus existants
        if (!cursus.lessons) {
          cursus.lessons = []; // Si le tableau de cursus est vide ou non défini
        }

        cursus.lessons.push(lessonToAddToCursus);

        // Étape 3: Mettre à jour le thème
        await updateCursus(cursusId, cursus);
        this.fetchThemes();

      } catch (error) {
        console.error(`Erreur lors de l'ajout du cursus`, error);
        throw new Error("Échec de l'enregistrement du thème.");
      }
    },

    // Réinitialisation des formulaires
    resetUserForm() {
      this.userForm = { name: "", email: "", role: "" };
      this.isEditingUser = false;
      this.currentUser = null;
    },
    resetThemeForm() {
      this.themeForm = { name: "" };
      this.isEditingTheme = false;
      this.currentTheme = null;
    },
  },
};
</script>

<style scoped>
/* Styles pour le composant */
.admin-dashboard {
  padding: 20px;
}

button {
  margin-left: 10px;
}

li {
  list-style: none;
  text-decoration: none;
}
</style>
