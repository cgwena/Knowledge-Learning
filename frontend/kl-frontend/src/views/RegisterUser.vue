<template>
  <div class="register">
    <h1>Créer un compte</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">Nom</label>
        <input type="name" id="name" v-model="name" required />
      </div>
      <div>
        <label for="firstname">Prénom</label>
        <input type="firstname" id="firstname" v-model="firstname" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @input="validatePassword"
          required
        />
        <p v-if="passwordError" style="color: red">{{ passwordError }}</p>
      </div>
      <div>
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { registerUser } from "@/services/user.service";

export default {
  data() {
    return {
      name: "",
      firstname: "",
      email: "",
      password: "",
      confirmPassword: "",
      message: "",
      passwordError: "",
    };
  },
  methods: {
    validatePassword() {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(this.password)) {
        this.passwordError = "Doit contenir : 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.";
      } else {
        this.passwordError = "";
      }
    },
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.message = "Les mots de passe ne correspondent pas.";
        return;
      }
      const userData = {
        name: this.name,
        firstname: this.firstname,
        email: this.email,
        password: this.password,
      };
      try {
        const response = await registerUser(userData);
        this.message = "Inscription réussie ! Veuillez confirmer votre e-mail.";
        return response;
      } catch (error) {
        this.message = "Erreur lors de l'inscription. Veuillez réessayer.";
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>

</style>
