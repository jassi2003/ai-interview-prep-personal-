const express = require('express');
const { togglePinQuestion, updateQuestionNote,addQuestionsToSession} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/add', protect,addQuestionsToSession);         
router.post('/:id/pin', protect,togglePinQuestion);     
router.get('/:id/note', protect,updateQuestionNote);            


module.exports = router;
 