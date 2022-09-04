const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const postSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      toLowerCase: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    posts: [postSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

module.exports = User;
