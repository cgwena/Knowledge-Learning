<template>
    <img alt="Knowledge logo" src="../assets/Logo_KL.png">
    <h1>Bienvenue chez KnowledgeLearning</h1>
    <p>Veuillez vous connecter pour accéder à votre compte</p>
    <LoginForm />
    <a href="/register">S'inscrire</a>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
    name: 'HomePage',
    components: {
   LoginForm
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