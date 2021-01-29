const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  region: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: Boolean,
    required: true,
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
