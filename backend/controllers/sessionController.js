 const Session=require("../models/session.js")
 const Question=require("../models/question.js")



//create session 
 exports.createSession=async(req,res)=>{
try{
const {role,experience,topicsToFocus,description,questions}=req.body
const userId=req.user._id

const createSession=await Session.create({
    user:userId,
    role,
    experience,
    topicsToFocus,
    description
})
const questionsDocs=await Promise.all(
    questions.map(async(q)=>{
        const question=await Question.create({
            session:createSession._id,
            question:q.question,
            answer:q.answer
        })
        return  question._id
    })
)
createSession.questions=questionsDocs
await createSession.save()

res.status(201).json({success:true,createSession,message:"session created successfully"})


}
catch(err){
   res.status(500).json({success:false,message:"Server error"}) 
}
 }

 //get all sessions


//  .populate("questions") tells Mongoose:
// "Go to the Question collection, find the documents with these IDs, and replace them with the actual question objects in the result."
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({
      success: true,
      message: "Sessions retrieved successfully",
      sessions,
    });
  } catch (err) {
    console.error("getMySessions error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



//get session by id
 exports.getSessionById=async(req,res)=>{
try{
const getSession=await Session.findById(req.params.id).sort({ createdAt: -1 })
.populate({path:"questions",options:{sort:{isPinned:-1,createdAt:1 }},})
.exec();

if(!getSession){
    return res.status(404).json({success:false,message:"session not found"})
}
res.status(200).json({success:true,getSession})

}
catch(err){
   res.status(500).json({success:false,message:"Server error"}) 
}
 }

//delete sesssion
 exports.deleteSession=async(req,res)=>{
     try{
    const dltSession=await Session.findById(req.params.id)

    if(!dltSession){
           return res.status(404).json({success:false,message:"session not found"})
    }
    //first delete all questions linked to this session
    await Question.deleteMany({session:dltSession._id})

    //then delete the whole session
    await dltSession.deleteOne()
    res.status(200).json({success:true,message:"session deleted successfully",dltSession})

    

}
catch(err){
   res.status(500).json({success:false,message:"Server error"}) 
}
 }


