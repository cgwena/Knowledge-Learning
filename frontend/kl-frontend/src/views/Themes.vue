<template>
  <NavBar />
  <main>
    <div class="themes-page">
      <h1>Les Thèmes des Leçons</h1>

      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-if="themes.length === 0" class="loading">
        <p>Chargement des thèmes...</p>
      </div>

      <div v-else>
        <ThemeCard
          v-for="theme in themes"
          :key="theme.id"
          :theme="theme"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";
import ThemeCard from "@/components/cours/ThemeCard.vue";
import { getThemes } from "@/services/lesson.service";
import { mapActions } from "vuex";
import { toast } from "vue3-toastify";

export default {
  name: "ThemesPage",
  components: {
    NavBar,
    ThemeCard,
  },
  data() {
    return {
      themes: [],
      error: null,
    };
  },
  async created() {
    try {
      this.themes = await getThemes(); // Appel du service pour récupérer les thèmes
    } catch (err) {
      this.error = "Une erreur est survenue lors du chargement des thèmes.";
    }
  },
  computed: {
    cartItems() {
      return this.$store.getters["cart/cartItems"];
    },
    cartTotal() {
      return this.$store.getters["cart/cartTotal"];
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },

  methods: {
    ...mapActions("cart", ["addToCart", "removeFromCart"]),
    async handleAddToCart(item) {
      console.log('handleAddToCart appelée');
      try {
        // Récupérer l'utilisateur et ses leçons
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user._id;
        console.log('userId:', userId)
        

        const response = await this.$store.dispatch(
          "auth/fetchUserById",
          userId
        );
        console.log('response:', response)
        const purchasedLessons = response.lessons || [];

        if (purchasedLessons.includes(item._id)) {
          toast.warning(`La leçon "${item.title}" a déjà été achetée.`);
          return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        const isInCart = cartItems.some(
          (cartItem) => cartItem._id === item._id
        );
        if (isInCart) {
          toast.warning(
            `La leçon "${item.title}" a déjà été ajoutée au panier.`
          );
          return;
        }

        this.$store.dispatch("cart/addToCart", item);
        toast.success(`La leçon "${item.title}" a été ajoutée au panier`);
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
      }
    },
  },
};
</script>

<style scoped>
.themes-page {
  padding: 20px;
}

.error {
  color: red;
}

.loading {
  color: gray;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}
</style>
