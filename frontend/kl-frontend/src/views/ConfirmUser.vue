<template>
  <div>
    <h1>Confirmation de l'inscription</h1>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { confirmRegistration } from "@/services/user.service";

export default {
  data() {
    return {
      message: "",
    };
  },
  async created() {
    // Récupère le token depuis la query string
    const token = this.$route.query.token;
    if (!token) {
      this.message = "Token manquant. Veuillez vérifier le lien.";
      return;
    }

    try {
      await confirmRegistration(token);
      this.message = "Votre compte a été confirmé avec succès !";
    } catch (error) {
      this.message = "Erreur lors de la confirmation. Veuillez réessayer.";
      console.error(error);
    }
  },
};
</script>
