<template>
  <NavBar />
  <div>
    <h1>Merci pour votre paiement !</h1>
  </div>
</template>

<script>
import NavBar from "@/components/layout/Navbar.vue";
import { updateUserLessonsAndCursus } from "@/services/user.service";
import { fetchCursusById, fetchLessonById } from "@/services/lesson.service";
import axios from "@/services/axios";

export default {
  name: "HomePage",
  components: {
    NavBar,
  },
  async created() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("orderId");

      if (!orderId) {
        console.error("Aucun orderId trouvé dans l'URL.");
        return;
      }

      const response = await axios.put(`http://localhost:3000/orders/${orderId}`, {"status": "completed"}); 
      console.log('response:', response)
      const order = response

      const itemData = await Promise.all(
        order.items.map(async (item) => {
          let data;
          try {
            if (item.type === "cursus") {
              data = await fetchCursusById(item.itemId);
            } else if (item.type === "lesson") {
              data = await fetchLessonById(item.itemId);
            }
            console.log('data:', data)
            return {
              id: item.itemId,
              type: item.type,
              data,
              isCompleted: false,
            };
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de ${item.type}:`,
              error
            );
            return null;
          }
        })
      );
      console.log('itemData:', itemData)

      if (itemData.length === 0) {
        console.error("Aucun item valide à ajouter à l'utilisateur.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        console.error("Utilisateur non trouvé.");
        return;
      }
      console.log('user:', user)

      const updatedUser = await updateUserLessonsAndCursus(
        user._id,
        itemData
      );
      console.log('updatedUser:', updatedUser)

      this.$store.commit("SET_USER", updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      this.$store.dispatch("cart/clearCart");
    } catch (error) {
      console.error("Erreur dans la mise à jour post-paiement :", error);
    }
  },
};
</script>
