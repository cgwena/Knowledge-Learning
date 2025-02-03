<template>
    <NavBar />
    <main>
      <section>
        
        <div v-if="userCertifiedCursus.length === 0" >
          <p>Vous n'avez pas encore de certification.</p>
        </div>
        <div v-else>
        
          <h3>Mes Certifications</h3>
          <CertifiedCursusCard 
          v-for="cursus in userCertifiedCursus"
          :cursus="cursus"
          :key="cursus.data._id"/>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import NavBar from "@/components/layout/Navbar.vue";
  import CertifiedCursusCard from "@/components/dashboard/CertifiedCursusCard.vue";
  import { getUserInfo } from "@/services/user.service";

  
  export default {
    name: "UserCertifications",
    components: { NavBar, CertifiedCursusCard },
    data() {
      return {
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
          this.userCertifiedCursus = response.data.cursus.filter((cursus) => cursus.isCompleted === true)
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
  