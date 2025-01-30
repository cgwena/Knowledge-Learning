const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Le nom est requis"],
    },
    firstname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    // Cursus suivis par l'utilisateur
    cursus: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Cursus", required: true },
        data: { type: Schema.Types.Mixed, required: true }, // Stocke l'objet entier
        lessons: [
          {
            _id: { type: Schema.Types.ObjectId, required: true },
            isCompleted: { type: Boolean, default: false },
          },
        ],
        isCompleted: { type: Boolean, default: false },
      },
    ],

    // Leçons achetées ou suivies par l'utilisateur
    lessons: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
        data: { type: Schema.Types.Mixed, required: true }, // Stocke l'objet entier
        isCompleted: { type: Boolean, default: false },
      },
    ],

    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pour hacher le mot de passe avant de sauvegarder
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Méthode pour mettre à jour l'état d'un cursus
UserSchema.methods.updateCurriculumStatus = function () {
  this.curriculums.forEach((curriculum) => {
    curriculum.isCompleted = curriculum.lessons.every(
      (lesson) => lesson.isCompleted
    );
  });
};

UserSchema.methods.completeLesson = function (lessonId) {
  let cursusUpdated = false;

  this.cursus.forEach((cursus) => {
    const lesson = cursus.lessons.find((l) => l._id.toString() === lessonId);
    if (lesson && !lesson.isCompleted) {
      lesson.isCompleted = true;
      cursusUpdated = true;
    }

    // Vérifie si toutes les leçons sont complètes pour mettre à jour `isCompleted` du cursus
    cursus.isCompleted = cursus.lessons.every((l) => l.isCompleted);
  });

  return cursusUpdated;
};

module.exports = mongoose.model("User", UserSchema);
