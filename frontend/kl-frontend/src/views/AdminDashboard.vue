<template>
  <Navbar />
  <div class="admin-dashboard">
    <!-- User management -->
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

    <!-- Themes management -->
    <div class="theme-management">
      <h2>Ajout d'un thème</h2>
      <form @submit.prevent="handleThemeSubmit">
        <!-- Field for the theme -->
        <input v-model="themeForm.title" placeholder="Nom du thème" required />

       <!-- Field for the cursus -->
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

          <!-- Field for the lessons -->
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

          <!-- Button to add a new lesson-->
          <button type="button" @click="addLessonToCursus(cursusIndex)">
            Ajouter une leçon
          </button>
        </div>

        <!-- Button to add a cursus -->
        <button type="button" @click="addCursusToTheme">
          Ajouter un cursus
        </button>

        <!-- Submit button -->
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
import Navbar from "@/components/layout/Navbar.vue";
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
    Navbar,
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
        this.users = response;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    },
    async handleUserSubmit() {
      const cleanUserForm = { ...this.userForm };

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

        this.resetForm();

        await this.fetchThemes();
      } catch (error) {
        console.error("Erreur globale :", error);
      }
    },

    resetForm() {
      this.themeForm = {
        title: "",
      };

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
          price: newCursus.price,
        });
        cursusToAddToTheme.push(response._id);
        const theme = await fetchThemeById(themeId);

        if (!theme.cursus) {
          theme.cursus = [];
        }

        theme.cursus.push(cursusToAddToTheme);

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
          price: newLesson.price,
          text: newLesson.text
        });
        lessonToAddToCursus.push(response._id);
        const cursus = await fetchCursusById(cursusId); 

        if (!cursus.lessons) {
          cursus.lessons = [];
        }

        cursus.lessons.push(lessonToAddToCursus);

        await updateCursus(cursusId, cursus);
        this.fetchThemes();

      } catch (error) {
        console.error(`Erreur lors de l'ajout du cursus`, error);
        throw new Error("Échec de l'enregistrement du thème.");
      }
    },

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
/* == MOBILE-FIRST (Styles par défaut) ==
   Styles pour les petits écrans
*/

.admin-dashboard {
  padding: 20px;
  /* Espace pour la navbar mobile (supposons 80px) + 20px de padding */
  padding-top: 100px;
  width: 100%;
  box-sizing: border-box; /* Important pour width: 100% */
}

/* Style de base (de votre code) */
li {
  list-style: none;
  text-decoration: none;
}

/* --- Formulaires (Mobile) --- */
/* Forcer l'empilement vertical */
form {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espace entre les champs */
}

/* Les champs de saisie prennent toute la largeur */
input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px; /* Améliore la lisibilité */
}

/* --- Boutons (Mobile) --- */
button {
  /* On supprime votre "margin-left: 10px" qui pose problème sur mobile */
  margin: 5px 0 0 0; /* Une petite marge en haut */
  cursor: pointer;
  padding: 8px; /* Améliore le clic */
}

/* --- Blocs imbriqués (Mobile) --- */
.cursus-input,
.lesson-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  margin-top: 10px;
  border: 1px dashed #ccc; /* Hiérarchie visuelle */
}

.lesson-input {
  margin-left: 15px; /* Indentation */
}

/* --- Liste des utilisateurs (Mobile) --- */
/* C'est le changement le plus important */
.user-management li {
  display: flex;
  flex-direction: column; /* Empiler l'info et les boutons */
  align-items: flex-start;
  gap: 10px;
  
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #eee; /* Séparation visuelle */
}

.user-management li button {
   margin: 0 10px 0 0; /* Marge à DROITE sur mobile */
   width: auto; /* Les boutons n'ont pas besoin de faire 100% */
}


/* == DESKTOP (Restauration de vos styles d'origine) ==
   À partir de 768px, on annule tout ce qu'on a fait pour mobile
   pour retrouver votre affichage d'origine.
*/
@media (min-width: 768px) {
  
  .admin-dashboard {
    /* (Hauteur nav desktop 16vh + 20px padding) */
    padding-top: calc(16vh + 20px); 
    width: auto; /* Annule width: 100% */
  }

  form {
    display: block; /* Annule flex-direction: column */
  }

  input,
  textarea {
    width: auto; /* Annule width: 100% */
    padding: 1px; /* Retour au style navigateur par défaut */
  }

  button {
    margin: 0 0 0 10px; /* RESTAURE votre règle d'origine */
    width: auto;
    padding: 1px; /* Retour au style navigateur par défaut */
  }

  /* --- Blocs imbriqués (Desktop) --- */
  .cursus-input,
  .lesson-input {
    display: block;
    padding: 0;
    margin-top: 0;
    border: none;
  }

  .lesson-input {
    margin-left: 0;
  }
  
  /* --- Liste des utilisateurs (Desktop) --- */
  .user-management li {
    display: block; /* Annule flex-direction: column */
    padding: 0;
    margin-bottom: 0;
    border: none;
  }
  
  .user-management li button {
     margin: 0 0 0 10px; /* RESTAURE votre règle d'origine */
  }
}
</style>

