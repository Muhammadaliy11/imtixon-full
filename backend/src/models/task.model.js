const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Sarlavha majburiy"],
      trim: true,
      minlength: [1, "Sarlavha bo'sh bo'lishi mumkin emas"],
      maxlength: [200, "Sarlavha 200 ta belgidan oshmasligi kerak"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Tavsif 1000 ta belgidan oshmasligi kerak"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["TODO", "IN_PROGRESS", "DONE"],
        message: "Status noto'g'ri qiymatga ega",
      },
      default: "TODO",
    },
    priority: {
      type: String,
      enum: {
        values: ["LOW", "MEDIUM", "HIGH"],
        message: "Priority noto'g'ri qiymatga ega",
      },
      default: "MEDIUM",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// userId ni JSON javobdan chiqarish (task ko'rsatishda)
taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  delete task.__v;
  return task;
};

module.exports = mongoose.model("Task", taskSchema);
