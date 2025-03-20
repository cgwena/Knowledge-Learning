import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

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
    // Cursus bought or followed by the user
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

    // Lessons bought or followed by the user
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
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Middlewre to hash the password before saving the user
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Method to update the status of the curriculum
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

    // Verify if all lessons are completed
    cursus.isCompleted = cursus.lessons.every((l) => l.isCompleted);
  });

  return cursusUpdated;
};

export default mongoose.model("User", UserSchema);
