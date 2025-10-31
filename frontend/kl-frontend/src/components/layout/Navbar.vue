<template>
  <nav>
    <a href="/" @click="closeMenu" class="nav-logo">
      <img src="../../assets/Logo_KL.png" alt="Knowledge logo" />
    </a>

    <button
      class="menu-toggle"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen.toString()"
      aria-controls="nav-links-list"
      aria-label="Ouvrir le menu"
    >
      <span class="burger-bar"></span>
      <span class="burger-bar"></span>
      <span class="burger-bar"></span>
    </button>

    <ul
      id="nav-links-list"
      class="nav-links"
      :class="{ 'menu-open': isMenuOpen }"
    >
      <li v-if="isAuthenticated && isAdmin">
        <a href="/admin" @click="closeMenu">Gestion du site</a>
      </li>

      <li><a href="/themes" @click="closeMenu">Nos cours</a></li>

      <li v-if="isAuthenticated">
        <a href="/dashboard" @click="closeMenu">Mon tableau de bord</a>
      </li>
      <li v-else>
        <a href="/login" @click="closeMenu">Se connecter</a>
      </li>

      <li v-if="isAuthenticated">
        <a href="/cart" @click="closeMenu">Mon panier</a>
      </li>

      <li v-if="isAuthenticated" @click="logout" class="logout-button">
        Se déconnecter
      </li>
    </ul>

    <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      isMenuOpen: false, // État pour gérer l'ouverture/fermeture du menu
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "getUser", "isAdmin"]),
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    logout() {
      this.closeMenu(); // Fermer le menu avant de se déconnecter
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
  watch: {
    // Si la route change (ex: via les boutons précédent/suivant),
    // on ferme le menu
    $route() {
      this.closeMenu();
    },
  },
};
</script>

<style scoped>
/* == MOBILE-FIRST (Styles par défaut) == */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color3);
  height: 80px; /* Hauteur fixe mobile */
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  padding: 0 1rem;
  box-sizing: border-box;
}

.nav-logo img {
  height: 60px;
  width: auto;
  border-radius: 8px;
}

/* --- Menu Burger (Mobile) --- */
.nav-links {
  list-style: none;
  margin: 0;
  padding: 2rem 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: fixed;
  z-index: 999;
  top: 80px;
  right: 0;
  height: calc(100vh - 80px);
  width: 75%;
  max-width: 350px;
  background-color: var(--color3);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.nav-links.menu-open {
  transform: translateX(0);
}

.nav-links li {
  list-style: none;
  width: 90%;
  text-align: center;
}

.nav-links a,
.logout-button {
  text-decoration: none;
  background-color: transparent;
  color: var(--color1);
  font-size: 1.4rem;
  font-weight: 500;
  display: block;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.nav-links a:hover,
.logout-button:hover {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
}

/* --- Bouton Burger (Mobile) --- */
.menu-toggle {
  display: flex; /* Visible par défaut */
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.burger-bar {
  width: 30px;
  height: 3px;
  background-color: var(--color1);
  border-radius: 2px;
}

/* --- Overlay (Mobile) --- */
.overlay {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

/* == TABLETTE ET DESKTOP (Breakpoint unique) == */
@media (min-width: 768px) {
  /* Cacher le burger et l'overlay */
  .menu-toggle,
  .overlay {
    display: none;
  }

  /* Votre style d'origine pour la nav (desktop) */
  nav {
    height: 16vh; /* Reprise de votre style d'origine */
    padding: 0 2rem;
  }

  .nav-logo img {
    height: 112px; /* Reprise de votre style d'origine */
    border-radius: 16px;
    margin-left: 16px;
  }

  /* Remettre le menu en affichage horizontal */
  .nav-links {
    transform: none;
    transition: none;
    position: static;
    flex-direction: row;
    width: 50vw; /* Reprise de votre style d'origine */
    height: 100%;
    padding-top: 0;
    box-shadow: none;
    background-color: transparent;
    justify-content: space-evenly; /* Reprise de votre style d'origine */
  }

  .nav-links li {
    width: auto;
  }

  .nav-links a,
  .logout-button {
    font-size: 1.2em; /* Reprise de votre style d'origine */
    padding: 0;
    background-color: transparent;
  }
}
</style>