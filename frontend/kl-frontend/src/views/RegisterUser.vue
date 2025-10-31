<template>
  <Navbar />
  <main>
    <div class="register">
      <h1>Créer un compte</h1>
      <form @submit.prevent="registerUser">
        <div class="field">
          <label for="name">Nom</label>
          <input type="name" id="name" v-model="name" placeholder="Nom" required />
        </div>
        <div class="field">
          <label for="firstname">Prénom</label>
          <input type="firstname" id="firstname" v-model="firstname" placeholder="Prénom" required />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="field">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Mot de passe"
            @input="validatePassword"
            required
          />
          <div></div>
          <p v-if="passwordError" style="color: red; font-size: large; background-color: #fff;">{{ passwordError }}</p>
        </div>
        <div class="field">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Mot de passe"
            v-model="confirmPassword"
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </main>
</template>

<script>
import Navbar from "@/components/layout/Navbar.vue";
import { registerUser } from "@/services/user.service";

export default {
  name: "RegisterUser",
  components: {
    Navbar,
  },
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
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(this.password)) {
        this.passwordError =
          "Doit contenir : 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.";
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
form {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
  padding: 16px;
  gap: 16px;
  background-color: var(--color2);
  border: 2px solid var(--color3);
  border-radius: 15px;
}

.field {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
}

input {
  padding: 8px;
  border: 1px solid var(--color3);
  border-radius: 5px;
  font-size: large;
}

label {
  margin-bottom: 4px;
  margin-right: 4px;
  color: #fff;
  font-size: 20px;
}

button {
  padding: 10px;
  background-color: var(--color1);
  color: var(--color4);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}
</style>
