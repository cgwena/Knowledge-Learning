<template>
  <NavBar />
  <main>
    <h1>Récapitulatif de votre commande</h1>

    <div v-if="!order">
      <p>Chargement...</p>
    </div>

    <div v-else class="order-details">
      <h2>Commande n° {{ order._id }}</h2>
      <ul>
        <li v-for="item in order.items" :key="item.itemId">
          {{ item.title }} - {{ item.price }} €
        </li>
      </ul>
      <h3>Total : {{ order.totalPrice }} €</h3>
      <ActionButton
        class="button"
        btnColor="primary"
        textContent="Payer"
        @click="handlePayOrder(order._id)"
      />
    </div>
  </main>
</template>
<script>
import NavBar from "@/components/layout/Navbar.vue";
import ActionButton from "@/components/ActionButton.vue";
import { getOrderById, payOrder } from "@/services/order.service";
import { fetchCursusById, fetchLessonById } from "@/services/lesson.service";
//import { updateUserLessonsAndCursus } from "@/services/user.service";

export default {
  name: "OrderRecap",
  components: {
    NavBar,
    ActionButton,
  },
  data() {
    return {
      order: null,
    };
  },
  async created() {
    const { orderId } = this.$route.params;

    try {
      const response = await getOrderById(orderId);
      this.order = response;
      await this.enrichOrderItems();
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande :", error);
    }
  },
  methods: {
    async handlePayOrder() {
      try {
        const response = await payOrder(this.order._id, this.order.items);
        window.location.href = response.url;
      } catch (error) {
        console.error("Erreur lors du paiement :", error);
        alert("Une erreur est survenue lors du paiement.");
      }
    },
    async enrichOrderItems() {
      const enrichedItems = await Promise.all(
        this.order.items.map(async (item) => {
          let details;
          try {
            if (item.type === "cursus") {
              const response = await fetchCursusById(item.itemId);
              details = response;
            } else if (item.type === "lesson") {
              const response = await fetchLessonById(item.itemId);
              details = response;
            }
            return {
              ...item,
              _id: details._id,
              title: details.title,
              price: details.price,
              lessons: details.lessons,
            };
          } catch (error) {
            console.error(
              `Erreur lors de la récupération des détails pour ${item.type} :`,
              error
            );
            return {
              ...item,
              title: "Nom non disponible",
              price: "N/A",
            };
          }
        })
      );

      this.order.items = enrichedItems;
    },
  },
};
</script>

<style scoped>
.order-details {
  border: 2px solid var(--color3);
  border-radius: 16px;
  background-color: var(--color2);
  margin: 24px;
  padding: 16px;
  color: var(--color1);
}

li {
  list-style: none;
  color: var(--color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  width: 130%;
}
</style>
