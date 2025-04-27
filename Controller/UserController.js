const express = require('express');
const User = require('../Models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const SendMail = require('../Mailer/SendMail');
const cloudinary=require('cloudinary').v2
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API, 
    api_secret: process.env.CLOUD_API_SECRET 
  });
const Register = async (req, res, next) => {
    try {
        const { username, password, phone, email, role } = req.body;
        //res.json(req.files.profile.tempFilePath)
        if (!username || !password || !email || !role || !phone) {
            return res.json({ status: false, message: "Enter All credentials" });
        }

        // Check if the user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: false, message: "User is Already Present" });
        }
  const {profile}=req.files;
        if(profile){
            await cloudinary.uploader.upload(profile.tempFilePath).then(async (e)=>{
                const user = await User.create({ username, password, email, role, phone,profile:{url:e.secure_url,public_id:e.public_id},profileSet:true });
               const data=await SendMail({email,mailType:"verify",UserId:user._id})
    console.log(data)
           if(data){
                res.status(200).json({status:true,message:"Verification mail send"})}
            })
        }else{

        // If the user doesn't exist, create a new user
        const user = await User.create({ username, password, email, role, phone });
        const token=jwt.sign({id:user._id,},"secret",{expiresIn:"3d"})
        res.status(200).cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), httpOnly: true,httpOnly: true,secure: true, sameSite: 'None',  }).json({ status: true, message: "User Registered", user });
        // const data=await SendMail({email,mailType:"verify",UserId:user._id})
        // if(data){
        //     res.status(200).json({status:true,message:"Verification mail send"})  
        // }
    }
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, message: "Internal Server Error" });
    } 
}
const VerifyMail=async (req,res,next)=>{
    try{
const {token}=req.body;
if(!token){
    res.status(404).json({status:false,message:"Token not Found"});
}
const user=await User.findOne({verifyToken: token,
    verifyTokenExpiry:{$gt:Date.now()}})
     console.log(user);
    if(!user){
       return res.status(200).json({status:false,message:"Token Expired Or user Not Authorized"});
    }
   
 user.isVerified=true;
 user.verifyToken=undefined;
 user.verifyTokenExpiry=undefined;
 await user.save();
 
   const token1=jwt.sign({id:user._id,},"secret",{expiresIn:"3d"})
 return res.status(200).cookie("token", token1, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), httpOnly: true,secure: true, sameSite: 'None',  }).json({ status: true, message: "User Registered and Verified", user });
//res.status(200).json({status:false,message:"User Verified"});
    }
    catch(err){
next(err);
    }
}
const HandleForgot=async(req,res,next)=>{
    try{
const {token,password}=req.body;
if(!token){
    return res.status(200).json({status:false,message:"Token not recognozed"});
}
 const user=await User.findOne({forgotPasswordToken: token,
    forgotPasswordTokenExpiry:{$gt: Date.now()},});
if(!user){
    return res.status(200).json({status:false,message:"User not recognozed"});
}
const hashed=await bcrypt.hash(password,10);
user.forgotPasswordToken=undefined;user.forgotPasswordTokenExpiry=undefined;
user.password=password;
await user.save();

return res.status(200).json({status:true,message:"User Password Updated",user});

    }catch(err){
next(err);
    }
}
const ForgotPassword=async (req,res,next)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email:email});
          if(!user){
            return res.status(200).json({status:false,message:"Usesnot found"})
          }
       const data= SendMail({email,mailType:"Forgot Password",UserId:user._id});
  
       if(!data){
    return res.status(200).json({status:false,message:"Error in sending verification mail"}) 
  }
 return res.status(200).json({status:true,message:"Verification mail send"}) 
    }catch(err){
        next(err); 
    }
}
const Login=async (req,res,next)=>{
try{
    //"password":"Heslllo123"
    const {email,password,role}=req.body;
    if(!email||!password||!role){
        return res.json({ status: false, message: "Enter All credentials" });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
        return res.json({ status: false, message: "User dosent exist" });
    }
 const comp =await existingUser.comparePassword(password); 
if(!comp){
    return res.json({ status: false, message: "User Email or Password is Incorrect" })
}
if(existingUser.role!=role){
    return res.json({ status: false, message: "role dosent match ewith user" })
}
 
const token=jwt.sign({id:existingUser._id,},"secret",{expiresIn:"3d"})  
let prod=process.env.PRODENV;
res.status(200).cookie("token",token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), httpOnly: true,secure: true,  sameSite: 'None', }).json({ status: true, message: "User Login", existingUser });

 
}
catch(err){ 
    console.log(err);
    return res.status(500).json({
        status: false,
        message: "Internal Server Error",
    })
}

}
const logout=async (req,res,next)=>{
    try{
const {token}=req.cookies;
if(!token){
    res.status(200).json({ status: false, message: "User is not present" });

}
res.status(200).cookie("token","", { expires: new Date(Date.now()), httpOnly: true, httpOnly: true,secure: true,  sameSite: 'None', }).json({ status: true, message: "User LogOut"});
    }
    catch(err){
        next(err);
    }

}
const GetUser=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    const ver= jwt.verify(token,"secret");
     if(!ver){
      res.status(500).json({status:false,message:"Cant fetch token"});
     }
     const id=ver.id;
     const user=await User.findById({_id:id});
   if(!user){
      res.status(500).json({status:false,message:"User not found failed"});  
   }
   res.status(200).json({status:true,message:"Here is user",user});


}
catch(err){
    next(err);
}
}
const getBy=async (req,res,next)=>{
    try{
        const {id}=req.params;
      //  console.log(id);
        const data= await User.findById({_id:id});
        if(data){
            return res.status(200).json({status:true,data});
        }else{
            return res.status(404).json({status:false});
        }
    }
    catch(err){
next(err);
    }
}
const setResume=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    const ver= jwt.verify(token,"secret");
     if(!ver){
      res.status(500).json({status:false,message:"Cant fetch token"});
     }
     const id=ver.id;
     const user=await User.findById({_id:id});
//    if(!user||user.role==="Employer"){
//       res.status(500).json({status:false,message:"User not found failed"});  
//    }
   
  
 //  res.json(user); 
   
   const {resume}=req.files;
 //res.json(resume);
   const Allowed=['image/png','image/jpg','image/jpeg','image/webp'];
   if(!Allowed.includes(resume.mimetype)){
    res.status(500).json({status:false,message:"Image format dosen't Match"});
}
// res.status(200).send(resume);
    let e=null;
 await cloudinary.uploader.upload(resume.tempFilePath).then((er)=>{
  e=er

 })
User.findByIdAndUpdate(id,{resume:e.secure_url,isResume:true},{new:true,runValidators:true,useFindAndModify:false}).then((ek)=>{

    res.status(200).json({status:true,message:"Here is user",ek});
    
    })
}catch(err){
next(err);
}
}
const updateUser=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    const ver= jwt.verify(token,"secret");
     if(!ver){
      res.status(500).json({status:false,message:"Cant fetch token"});
     }
     const id=ver.id;
     const user=await User.findById({_id:id}).select('+password');
   if(!user){
      return res.status(500).json({status:false,message:"User not found failed"});  
   }
   
const {username,password,newPassword,email,phone}=req.body;
if (!username || !password || !email || !phone) {
    return res.json({ status: false, message: "Enter All credentials" });
}
const comp=await bcrypt.compare(password,user.password);
if(!comp){
 return   res.status(200).json({status:false,message:"Password is Incorrect"}) 
}
if(newPassword&&newPassword.length<6){
    return res.status(200).json({status:false,message:"Password length is Short"}) 
}
const passkey = await bcrypt.hash(newPassword, 10)
//res.status(200).json(req.body)
await User.findByIdAndUpdate(id,{username,email,password:passkey,phone},{runValidators:true,useFindAndModify:false}).then((e)=>{
   return  res.status(200).json({status:true,message:"User Updated",e});
}).catch((err)=>{
    return res.status(200).json({status:false,message:"Error",err});
})


}
catch(err){
next(err);
}
}
const updateProfil=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        const ver= jwt.verify(token,"secret");
         if(!ver){
          res.status(500).json({status:false,message:"Cant fetch token"});
         }
         const id=ver.id;
         const user=await User.findById({_id:id}).select('+password');
       if(!user){
          res.status(500).json({status:false,message:"User not found failed"});  
       }
       
const {profile}=req.files;
await cloudinary.uploader.upload(profile.tempFilePath).then((er)=>{
User.findByIdAndUpdate(id,{profile:{url:er.secure_url,public_id:er.public_id}},{new:true,runValidators:true,useFindAndModify:false}).then((usr)=>{
res.status(200).json({status:true,message:"User Profile Updated",user:usr});
})
}).catch((er)=>{
    res.status(500).json({status:true,message:"User Profile is not Updated"})
})

    }
    catch(err){
        next(err);
    }
}

const getAllExpert=async (req,res,next)=>{
    try{
const experts=await User.find({role:"Expert"});
return res.status(200).json({status:true,message:"Here are all experts",experts})
    }
    catch(err){
   return res.status(500).json({status:false,message:"Cant fetch experts"})
    }
}

 

 

module.exports = { getAllExpert,Register,Login,logout,GetUser,getBy,updateUser,setResume,updateProfil,VerifyMail,ForgotPassword,HandleForgot};
