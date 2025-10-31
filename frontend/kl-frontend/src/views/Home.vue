<template>
  <NavBar />
  <main>
    <img alt="Knowledge logo" src="../assets/Logo_KL.png" />
    <h1>Bienvenue chez KnowledgeLearning</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
  },
};
</script>

<style scoped>
/* == MOBILE-FIRST (Styles par défaut) == */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  width: 100%;
  padding: 1.5rem;
  text-align: center;
  box-sizing: border-box;
}

img {
  width: 50%;
  max-width: 150px; /* Taille mobile */
  height: auto;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.8rem; /* Taille mobile */
  margin-bottom: 1rem;
  line-height: 1.2;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  max-width: 90%;
}

/* == TABLETTE (Breakpoint) ==
  Ces styles s'appliquent à partir de 768px ET au-delà (desktop inclus)
*/
@media (min-width: 768px) {
  img {
    max-width: 200px; /* Logo légèrement plus grand */
  }

  h1 {
    font-size: 2.5rem; /* Titre plus grand */
  }

  p {
    font-size: 1.1rem;
    max-width: 80%;
  }
}

/* Le bloc @media (min-width: 1024px) a été supprimé */
</style>