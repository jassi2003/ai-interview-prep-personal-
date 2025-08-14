const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"  // references a Session model
  },
  question: String,
  answer: String,
  note: String,
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

module.exports = mongoose.model("Question", questionSchema);
