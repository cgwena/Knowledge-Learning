<template>
  <div v-if="lesson" class="lesson-details">
    <h1>{{ lesson.title }}</h1>
    <p v-if="lesson.text">{{ lesson.text }}</p>
    <video v-if="lesson.video_url" controls>
      <source :src="lesson.video_url" type="video/mp4" />
      Votre navigateur ne supporte pas les vidéos HTML5.
    </video>
    <p v-else>Aucune vidéo disponible pour cette leçon.</p>
    <ActionButton
      class="button"
      btnColor="secondary"
      textContent="Valider la leçon"
      @click="validateLesson(lesson._id)"
    />
  </div>
  <p v-else>Chargement de la leçon...</p>
</template>

<script>
import ActionButton from "@/components/ActionButton.vue";
import { fetchLessonById } from "@/services/lesson.service";
import { markLessonAsCompleted } from "@/services/user.service";

export default {
  name: "LessonDetails",
  components: {
    ActionButton,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      lesson: null,
      error: null,
    };
  },
  async created() {
    try {
      this.lesson = await fetchLessonById(this.id);
    } catch (err) {
      console.error("Erreur lors de la récupération de la leçon :", err);
      this.error = "Impossible de charger les détails de cette leçon.";
    }
  },
  methods: {
    async validateLesson() {
      try {
        await markLessonAsCompleted(this.lesson._id);
        this.lesson.isCompleted = true;
      } catch (err) {
        console.error("Erreur lors de la validation de la leçon :", err);
      }
    },
  },
};
</script>

<style scoped>
.lesson-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
video {
  width: 100%;
  margin-top: 20px;
}
</style>
