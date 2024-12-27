<template>
  <NavBar />
  <main>
    <section>
      <h2>Mes cours</h2>
      <div v-if="userLessons.length === 0">
        <p>Vous n'avez pas encore de leçons.</p>
      </div>
      <div v-else>
        <component
          v-for="lesson in userLessons"
          :key="lesson._id"
          :is="lesson.isLesson ? 'LessonList' : 'CursusCard'"
          :lesson="lesson.isLesson ? lesson : null"
          :cursus="lesson.isCursus ? lesson : null"
        />
      </div>
    </section>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";
import { getUserInfo } from "@/services/user.service";
import { fetchCursusById, fetchLessonById } from "@/services/lesson.service";
import LessonList from "@/components/dashboard/LessonList";
import CursusCard from "@/components/dashboard/CursusCard";

export default {
  name: "DashBoard",
  components: { NavBar, LessonList, CursusCard },
  data() {
    return {
      userLessons: [],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  async created() {
    if (this.isAuthenticated) {
      try {
        const response = await getUserInfo(); // Appel pour récupérer les données utilisateur
        const lessonsIds = response.data.lessons; // Supposons que `lessons` est un tableau d'IDs

        for (let id of lessonsIds) {
          try {
            let lessonData = null;

            try {
              lessonData = await fetchLessonById(id);
              if (lessonData && lessonData.title) {
                this.userLessons.push({
                  ...lessonData,
                  isLesson: true, // Indiquer que c'est une leçon
                });
              } else {
                console.log(
                  `Aucune leçon trouvée pour l'ID ${id}, vérification du cursus...`
                );
                try {
                  const cursusData = await fetchCursusById(id);
                  if (cursusData && cursusData.title) {
                    this.userLessons.push({
                      ...cursusData,
                      isCursus: true,
                    });
                  } else {
                    console.warn(
                      `Aucune donnée trouvée pour le cursus ID ${id}`
                    );
                  }
                } catch (cursusError) {
                  console.error(
                    `Erreur lors de la récupération du cursus pour l'ID ${id}:`,
                    cursusError
                  );
                }
              }
            } catch (lessonError) {
              // Si l'appel pour la leçon échoue, on tente de récupérer un cursus
              console.error(
                `Erreur lors de la récupération de la leçon pour l'ID ${id}:`,
                lessonError
              );
              try {
                const cursusData = await fetchCursusById(id);
                if (cursusData && cursusData.title) {
                  this.userLessons.push({
                    ...cursusData,
                    isCursus: true, // Indiquer que c'est un cursus
                  });
                } else {
                  console.warn(`Aucune donnée trouvée pour le cursus ID ${id}`);
                }
              } catch (cursusError) {
                console.error(
                  `Erreur lors de la récupération du cursus pour l'ID ${id}:`,
                  cursusError
                );
              }
            }
          } catch (error) {
            console.error(
              `Erreur générale lors de la récupération de l'ID ${id}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des leçons:", error);
      }
    }
  },
};
</script>

<style scoped>
li {
  list-style: none;
  text-decoration: none;
}
</style>
