 const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // refers to the User model
  },
  role: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  topicsToFocus: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question" // refers to Question model
    }
  ]
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Session", sessionSchema);
