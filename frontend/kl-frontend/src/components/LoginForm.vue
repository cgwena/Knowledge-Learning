<template>
  <div class="login-form">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Entrez votre email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Entrez votre mot de passe"
          required
        />
      </div>

      <button type="submit" class="btn">Se connecter</button>
    </form>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleLogin() {
      this.error = null; // Réinitialise les erreurs
      if (!this.email || !this.password) {
        this.error = "Tous les champs sont obligatoires.";
        return;
      }

      try {
        const response = await this.login({
          email: this.email,
          password: this.password,
        });
        if (response.data.token) {
          // Le token est automatiquement géré dans Vuex et localStorage
          this.$router.push("/themes"); // Rediriger vers la page suivante
        } else {
          throw new Error("Identifiants invalides.");
        }
      } catch (err) {
        this.error = err.message || "Une erreur est survenue.";
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover {
  background-color: #0056b3;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
