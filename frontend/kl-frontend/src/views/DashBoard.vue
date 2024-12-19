<template>
  <NavBar />
  <main>
    <section>
      <h2>Mes cours</h2>

      <h2>Mes informations personnelles</h2>
    </section>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";

export default {
  name: "DashBoard",
  components: { NavBar },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
};
</script>

<style scoped></style>
