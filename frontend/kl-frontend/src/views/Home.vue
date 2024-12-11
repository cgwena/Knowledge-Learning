<template>
  <NavBar />
  <main>
    <img alt="Knowledge logo" src="../assets/Logo_KL.png" />
    <h1>Bienvenue chez KnowledgeLearning</h1>
    <p>Lorem ipsum</p>
  </main>
</template>

<script>
import NavBar from "@/components/layout/NavBar.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
  },
};
</script>

<style scoped></style>
