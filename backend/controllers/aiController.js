const {GoogleGenAI}=require("@google/genai")
const {conceptExplainPrompt, questionAnswerPrompt}=require("../utils/prompts")
 const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});




//generate interview questions and answers using gemini
exports.generateInterviewQuestions=async(req,res)=>{
try{
const {role,experience,topicsToFocus,numberOfQuestions}=req.body
if(!role || !experience || !topicsToFocus || !numberOfQuestions){
    return res.status(400).json({message:"missing fields"})
}
const prompt=questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions)

const response=await ai.models.generateContent({
    model:"gemini-2.0-flash-lite",
    contents:prompt
})
const rawText=response.text
//clean it:remove ```json and ``` from from begg and end
const cleanedText=rawText
.replace(/^```json\s*/,"")  //remove ``` json
.replace(/```$/,"") //remove ending ```
.trim()

//now safe to parse
const data= JSON.parse(cleanedText)


res.status(200).json(data)
 
}
catch(err){
   res.status(500).json({
    message:"server error",
    error:err.message,
   }) 
}
}

 
//generate explanation
exports.generateConceptExplanation=async(req,res)=>{
try{
const {question}=req.body
if(!question){
    return res.status(400).json({message:"missing field", success:false})
}
const prompt=conceptExplainPrompt(question)
const response=await ai.models.generateContent({
    model:"gemini-2.0-flash-lite",
    contents:prompt
})
const rawText=response.text
//clean it:remove ```json and ``` from from begg and end
const cleanedText=rawText
.replace(/^```json\s*/,"")  //remove ``` json
.replace(/```$/,"") //remove ending ```
.trim()

//now safe to parse
const data= JSON.parse(cleanedText)


res.status(200).json({
    success:true,
    data})
 
}
catch(err){
   res.status(500).json({
    message:"server error",
    error:err.message,
   }) 
}
}

