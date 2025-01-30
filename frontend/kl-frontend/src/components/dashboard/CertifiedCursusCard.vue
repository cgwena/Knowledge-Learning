<template>
    <div class="cursus-card">
      <h3>{{ cursus.data.title }}</h3>
      <div class="certified">Cursus Complété</div>
    </div>
  </template>
  
  <script>  
  export default {
    name: "CertifiedCursusCard",
    props: {
      cursus: Object,
    },
  };
  </script>
  
  <style scoped>
  .cursus-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 10px;
  }

  .certified {
    border: 1px solid var(--green1);
    border-radius: 5px;
    padding: 5px;
    background-color: var(--green1);
    color: var(--color1);
  }
  </style>
  