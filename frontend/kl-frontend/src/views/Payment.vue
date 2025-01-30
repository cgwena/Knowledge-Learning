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
          @click="handlePayOrder(order._id)"
        />
      </div>
    </main>
  </div>
</template>
<script>
import ActionButton from "@/components/ActionButton.vue";
import { getOrderById, payOrder } from "@/services/order.service";
import { fetchCursusById, fetchLessonById } from "@/services/lesson.service";
import { updateUserLessonsAndCursus } from "@/services/user.service";

export default {
  name: "OrderRecap",
  components: {
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
      this.order = response.data;
      await this.enrichOrderItems();
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande :", error);
    }
  },
  methods: {
    async handlePayOrder() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  console.log("order.items", this.order.items);

  try {
    // Récupérer les objets complets pour chaque item
    const itemData = await Promise.all(
      this.order.items.map(async (item) => {
        let data;
        
        // Utiliser la bonne fonction en fonction du type
        if (item.type === "cursus") {
          const response = await fetchCursusById(item.itemId);
          console.log('response pour cursus', response)
          data = response;
        } else if (item.type === "lesson") {
          const response = await fetchLessonById(item.itemId);
          data = response;
        }

        return {
          id: item.itemId, // ID de l'objet
          type: item.type, // Type (cursus ou lesson)
          data, // Objet complet récupéré depuis l'API
          isCompleted: false, // Initialisation à false
        };
      })
    );

    // Mettre à jour les leçons et cursus de l'utilisateur
    const updatedUser = await updateUserLessonsAndCursus(userId, itemData);

    // Mettre à jour le store et le localStorage
    this.$store.commit("SET_USER", updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Finaliser le paiement
    await payOrder(this.order._id);

    // Rediriger l'utilisateur
    this.$store.dispatch("cart/clearCart");
    alert("Paiement réussi !");
    this.$router.push({ name: "Dashboard" });
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
              lessons : details.lessons
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
