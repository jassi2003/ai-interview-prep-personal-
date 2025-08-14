// import User from '../models/user.js'
const bcrypt =require('bcryptjs')
const  jwt= require('jsonwebtoken')
 const User=require("../models/user.js")



const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async (req, res) => {
  const {  name, email, password } = req.body;
    const profilePic = req.file ? req.file.path : null;  // or req.file.filename based on your usage


  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists, please login",
        error: true,
        success: false
      });
    }
// A salt is a random string added to the password before hashing.
// 10 is the cost factor (also called "rounds").
// What is .hash() doing?
// It takes your plain-text password and the generated salt, then creates a secure, irreversible hash.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      profilePic,
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_pic: user.profilePic,
      token:generateToken(user._id),
      message: "User registered successfully.....",
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false
    });
  }
};




const loginUser=async(req,res)=>{
const {email,password}=req.body

try{
const findUser=await User.findOne({email})
if(!findUser){
    return res.status(500).json({
        message:"invalid email or passwordd",
        success:false,
        error:true
    })
}
    const isMatch=await bcrypt.compare(password,findUser.password)
    if(!isMatch){
          return res.status(500).json({
        message:"invalid email or password",
        success:false,
        error:true
    })
}  

       return res.status(201).json({
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      profile_pic: findUser.profilePic,
      token:generateToken(findUser._id),
      message: "User logged in  successfully",
      success: true
    });
}
    catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false
    });
}

}

const getUserProfile=async(req,res)=>{
    try{

        const findUser=await User.findById(req.user.id).select("-password")
        if(!findUser){
        return res.status(404).json({
            message:"user not found",
            error:true,
            success:false
        })
        }
        return res.json({success:true,data:findUser})
    }
    catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false
    });
}

}



module.exports={loginUser,registerUser,getUserProfile}
