<template>
  <div class="order-recap">
    <NavBar />
    <main>
      <h1>Récapitulatif de votre commande</h1>

      <div v-if="!order">
        <p>Chargement...</p>
      </div>

      <div v-else>
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
            @click="handlePayOrder(order._id)" />
      </div>
    </main>
  </div>
</template>

<script>
import ActionButton from "@/components/ActionButton.vue";
import { getOrderById, payOrder } from "@/services/order.service";
import { fetchCursusById, fetchLessonById } from "@/services/lesson.service"; // Ajoutez les services pour récupérer les détails


export default {
  name: "OrderRecap",
  components: {
    ActionButton
  },
  data() {
    return {
      order: null,
      orderId: null
    };
  },
  async created() {
    const { orderId } = this.$route.params;
    
    try {
      const response = await getOrderById(orderId);
      this.order = response.data;
      await this.enrichOrderItems();
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande :", error);
    }
  },
  methods: {
    async handlePayOrder(orderId) {
      try {
        await payOrder(orderId);
        this.$store.dispatch("cart/clearCart");
        alert("Paiement réussi !");
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Erreur lors du paiement :", error);
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
              title: details.title,
              price: details.price,
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération des détails pour ${item.type} :`, error);
            return {
              ...item,
              title: "Nom non disponible",
              price: "N/A",
            };
          }
        })
      );

      // Met à jour les items enrichis dans la commande
      this.order.items = enrichedItems;
    },
  },
};
</script>

<style scoped>
.order-recap {
  padding: 20px;
}
</style>
