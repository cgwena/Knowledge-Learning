<template>
  <NavBar />
  <main>
    <div class="cart-page">
      <h1>Mon Panier</h1>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Votre panier est vide.</p>
      </div>

      <div v-else>
        <div v-for="item in cartItems" :key="item._id" class="cart-item">
          <div class="cart-item-details">
            <h3>{{ item.title }}</h3>
            <p>{{ item.price }} €</p>
          </div>
          <div class="remove-button">
            <ActionButton
              class="button"
              btnColor="primary"
              textContent="Supprimer"
              @click="removeFromCart(item)"
            />
          </div>
        </div>

        <div class="cart-total">
          <h3>Total: {{ cartTotal }} €</h3>
          <ActionButton
            class="button"
            btnColor="primary"
            textContent="Passer la commande"
            @click="checkout"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";
import ActionButton from "@/components/ActionButton.vue";
import { mapActions } from "vuex";
import { createOrder } from "@/services/order.service";

export default {
  name: "CartPage",
  components: {
    NavBar,
    ActionButton,
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
    ...mapActions("cart", ["removeFromCart"]),
    async checkout() {
      console.log("cartItems", this.cartItems);
      const items = this.cartItems.map((item) => {
        const type = item.lessons ? "cursus" : "lesson"; // Si l'objet a des leçons, c'est un cursus
        return {
          itemId: item._id,
          type, 
        };
      });
      const orderData = {
        items,
        totalPrice: this.cartTotal,
      };
      try {
        const response = await createOrder(orderData);

        // Vider le panier
        const orderId = response.data._id
        // Rediriger vers la page récapitulative
        this.$router.push(`/payment/${orderId}`);
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
      }    
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.cart-item-details {
  flex: 1;
}

.cart-total {
  margin-top: 20px;
  font-weight: bold;
}

.empty-cart {
  text-align: center;
}

.checkout-button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}

.remove-button button {
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
