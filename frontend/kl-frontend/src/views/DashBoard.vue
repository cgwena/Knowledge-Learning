<template>
  <NavBar />
  <main>
    <section>
      <h2>Mes certifications</h2>
      <div v-if="userCertifiedCursus.length === 0">
        <p>Vous n'avez pas encore de certification</p>
      </div>
      <div v-else>
        <ActionButton
      class="button"
      btnColor="secondary"
      textContent="Voir mes certifications"
      @click="goToCertifications"
    />      </div>
      <h2>Mes cours</h2>
      <div v-if="userLessons.length === 0" >
        <p>Vous n'avez pas encore de leçons.</p>
      </div>
      <div v-else>
        <h3>Mes leçons</h3>
        <LessonList
          v-for="lesson in userLessons"
          :lesson="lesson.data"
          :key="lesson.data._id"
        />
      </div>
      <div v-if="userCursus.length === 0" >
        <p>Vous n'avez pas encore de cursus.</p>
      </div>
      <div v-else>
        <h3>Mes cursus</h3>
        <CursusCard 
        v-for="cursus in userCursus"
        :cursus="cursus"
        :key="cursus.data._id"/>
      </div>
    </section>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";
import { getUserInfo } from "@/services/user.service";
import LessonList from "@/components/dashboard/LessonList";
import CursusCard from "@/components/dashboard/CursusCard";
import ActionButton from "@/components/ActionButton.vue";

export default {
  name: "DashBoard",
  components: { NavBar, LessonList, CursusCard, ActionButton },
  data() {
    return {
      userLessons: [],
      userCursus: [],
      userCertifiedCursus: []
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  async created() {
    if (this.isAuthenticated) {
        const response = await getUserInfo(); // Appel pour récupérer les données utilisateur
        this.userLessons = response.data.lessons; 
        this.userCursus = response.data.cursus
        this.userCertifiedCursus = response.data.cursus.filter((cursus) => cursus.isCompleted === true)    
      }
  },
  methods: {
    goToCertifications() {
      this.$router.push('/certifications')
    }
  }
};
</script>

<style scoped>
li {
  list-style: none;
  text-decoration: none;
}
</style>
