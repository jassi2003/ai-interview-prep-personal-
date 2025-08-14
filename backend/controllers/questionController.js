const Session=require("../models/session.js")
const Question=require("../models/question.js")



exports.addQuestionsToSession=async(req,res)=>{
try{
const {sessionId,questions}=req.body
if(!sessionId || !questions || !Array.isArray(questions)){
    return res.status.json({message:"invalid input data"})
}
const session=await Session.findById(sessionId)
if(!session){
    return res.status(404).json({message:"session not found"})
}
//create new questions
const createdQuestions=await Question.insertMany(
    questions.map((q)=>({
session:sessionId,
question:q.question,
answer:q.answer
    }))
);
//update sessions to include new question ids
session.questions.push(...createdQuestions.map((q)=>q._id))
await session.save()

return res.status(201).json({
    success:true,
    createdQuestions})
}
catch(err){
  res.status(500).json({success:false,message:"Server error"}) 
}
}




 exports.togglePinQuestion=async(req,res)=>{
try{
 const question=await Question.findById(req.params.id)

 if(!question){
    res.status(404).json({
        message:"question not found",
        success:false
    })
 }
 question.isPinned=!question.isPinned
 await question.save()
 res.status(200).json({
success:true,
question
 })

}
catch(err){
   res.status(500).json({success:false,message:"Server error"}) 
}
 }


 
 exports.updateQuestionNote=async(req,res)=>{
try{
    const {note}=req.body
 const question=await Question.findById(req.params.id)
 if(!question){
    res.status(404).json({
        message:"question not found",
        success:false
    })
 }
 question.note=note || ""
 await question.save()
 
 res.status(200).json({
success:true,
question
 })
}
catch(err){
   res.status(500).json({success:false,message:"Server error"}) 
}
 }

