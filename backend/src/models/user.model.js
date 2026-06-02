const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "To'liq ism majburiy"],
      trim: true,
      minlength: [2, "Ism kamida 2 ta belgi bo'lishi kerak"],
    },
    email: {
      type: String,
      required: [true, "Email majburiy"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email formati noto'g'ri"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// passwordHash ni JSON da qaytarmaslik
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshToken;
  return user;
};

module.exports = mongoose.model("User", userSchema);
