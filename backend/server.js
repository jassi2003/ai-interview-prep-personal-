const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes=require('./routes/sessionRoutes');
const questionRoutes=require("./routes/questionRoutes");
const { protect } = require('./middlewares/authMiddleware');
const {generateConceptExplanation,generateInterviewQuestions}=require("./controllers/aiController")

const app = express();

app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));



// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions",protect,generateInterviewQuestions)
app.use("/api/ai/generate-explanation",protect,generateConceptExplanation)


app.get('/', (req, res) => {
  res.send("server is working");
});

const PORT = process.env.PORT || 9000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("connected to db");
    console.log(`server is listening on port ${PORT}`);
  });
});
