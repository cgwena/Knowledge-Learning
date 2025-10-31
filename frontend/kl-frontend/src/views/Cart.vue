<template>
  <NavBar />
  <main>
    <div class="cart-page">
      <h1>Mon Panier</h1>
      <card>
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Votre panier est vide.</p>
        </div>

        <div v-else class="cart-items">
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
      </card>
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
      const items = this.cartItems.map((item) => {
        const type = item.lessons ? "cursus" : "lesson";
        return {
          itemId: item._id,
          type,
        };
      });
      console.log("items", items);
      const orderData = {
        items,
        totalPrice: this.cartTotal,
      };
      try {
        const response = await createOrder(orderData);

        const orderId = response._id;

        this.$router.push(`/payment/${orderId}`);
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
      }
    },
  },
};
</script>

<style scoped>

.cart-items {
  border: 2px solid var(--color3);
  border-radius: 16px;
  background-color: var(--color2);
  margin: 24px;
  color: var(--color1);
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
</style>
