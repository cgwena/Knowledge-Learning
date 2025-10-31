<template>
  <div class="login-form">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin" novalidate>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Entrez votre email"
          required
          autocomplete="email"
          :aria-invalid="!!emailError"
          aria-describedby="email-error"
        />
        <div v-if="emailError" id="email-error" class="error-message">
          {{ emailError }}
        </div>
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Entrez votre mot de passe"
          required
          autocomplete="current-password"
          :aria-invalid="!!passwordError"
          aria-describedby="password-error"
        />
        <div v-if="passwordError" id="password-error" class="error-message">
          {{ passwordError }}
        </div>
      </div>

      <button type="submit" class="btn">Se connecter</button>
    </form>

    <p v-if="globalError" class="global-error-message" role="alert">
      {{ globalError }}
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      // Erreurs séparées pour une meilleure accessibilité
      emailError: null,
      passwordError: null,
      globalError: null,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleLogin() {
      // Réinitialise toutes les erreurs
      this.emailError = null;
      this.passwordError = null;
      this.globalError = null;
      
      let hasValidationErrors = false;

      // Validation des champs
      if (!this.email) {
        this.emailError = "L'adresse email est obligatoire.";
        hasValidationErrors = true;
      }
      if (!this.password) {
        this.passwordError = "Le mot de passe est obligatoire.";
        hasValidationErrors = true;
      }
      
      // Stop si des erreurs de validation sont présentes
      if (hasValidationErrors) {
        return;
      }

      try {
        const response = await this.login({
          email: this.email,
          password: this.password,
        });
        if (response.token) {
          this.$router.push("/themes");
        } else {
          // Gère les cas où la réponse ne contient pas de token
          this.globalError = "Identifiants invalides.";
        }
      } catch (err) {
        // Gère les erreurs réseau ou les échecs de l'API
        this.globalError = err.message || "Identifiants invalides.";
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 600px;
  margin: 16px auto;
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

/* AJOUT : Style de focus visible pour la navigation clavier */
input:focus,
.btn:focus {
  outline: 3px solid #0056b3;
  outline-offset: 2px;
  border-color: #007bff;
}

/* AJOUT : Style pour les champs invalides */
input[aria-invalid="true"] {
  border-color: red;
  background-color: #fff8f8;
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

/* Style pour les erreurs de champ */
.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

/* Style pour l'erreur globale (alerte) */
.global-error-message {
  color: red;
  margin-top: 15px;
  font-weight: bold;
  text-align: center;
}
</style>