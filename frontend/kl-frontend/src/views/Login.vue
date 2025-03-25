<template>
    <Navbar />
    <img alt="Knowledge logo" src="../assets/Logo_KL.png">
    <h1>Bienvenue chez KnowledgeLearning</h1>
    <p>Veuillez vous connecter pour accéder à votre compte</p>
    <LoginForm />
    <a href="/register">S'inscrire</a>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import Navbar from '@/components/layout/Navbar.vue';

export default {
    name: 'HomePage',
    components: {
   LoginForm,
   Navbar
  },
}

</script>

<style scoped>
img {
    height: 64px;
    border-radius: 16px;
    margin-left: 16px;
}
</style>