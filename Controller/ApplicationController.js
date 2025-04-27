const Job =require('../Models/Job');
const jwt=require('jsonwebtoken')
const User=require('../Models/User')
const Application=require('../Models/Application')
const cloudinary=require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'dneeum0v1', 
    api_key: '951164984623356', 
    api_secret: 'YC86zF3N1b5Ue0EhxX5GjK2SoOg' 
  });
const empGetAllJob=async (req,res,next)=>{
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
       if(user.role==="Job seeker"){
          res.status(500).json({status:false,message:"Seeker Cannot Post"})
       }
       const applications=await Application.find({'employerId.user':id});
      res.status(200).json({status:true,message:"These are your  posted Application",applications});

    }
    catch(err){
        next(err);
    }
}
const ApplAllJobs=async (req,res,next)=>{
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
       if(user.role ==="Employer"){
          res.status(500).json({status:false,message:"Applicant cant have posted jobs"})
       }
       const applications=await Application.find({'ApplicantId.user':id});
       //const applications=await Application.find();
      res.status(200).json({status:true,message:"These are your Applications",applications});   

    }
    catch(err){
        next(err);
    }
}
const JobSeekDel=async (req,res,next)=>{
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
       if(user.role==="Employer"){
          res.status(500).json({status:false,message:"Employer Cannot Delete"})
       }
       const {Id}=req.params;
       const application= await Application.findById({_id:Id});
        if(!application){
            res.status(404).json({status:false,message:"Coudn't find job "});    
        }
       
        const del=await Application.findByIdAndDelete({_id:Id});
        res.status(200).json({status:true,message:"Delteted Job",del});
       
    }
    catch(err){
        next(err);
    }
}
const CreateApplication=async (req,res,next)=>{
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
  // res.json({user}); 
   if(user.role==="Employer"){
      res.status(500).json({status:false,message:"Employer Cannot Delete"})
   }
   const {resume}=req.files;
   const Allowed=['image/png','image/jpg','image/jpeg','image/webp'];
   if(!Allowed.includes(resume.mimetype)){
    res.status(500).json({status:false,message:"Image format dosent Match"});
   }
  

   const cloudupload=await cloudinary.uploader.upload(resume.tempFilePath)
if(!cloudupload||cloudupload.error){
    console.log(cloudupload.error||"Error in Cloudinary")
    res.status(500).json({status:false,message:"Cloudinary Error"});
}
const {email,phone,address,coverletter,name}=req.body;
const ApplicantId={
user:user._id,
role:"Job seeker"
}
const {JobId}=req.body;
const findJob= await Job.find({_id:JobId});

if(!findJob){   
 res.status(500).json({status:false,message:"Cant find Job"});
}
const employerId={
    user:findJob[0].postedBy,
    role:"Employer"
}
if(!email||!phone||!address||!coverletter||!name||!JobId||!resume){
    res.status(500).json({status:false,message:"Enter all Field"})
}
const jo= new Application({
    email,phone,address,coverletter,name,ApplicantId,employerId,resume:{
        public_id:cloudupload.public_id,
        url:cloudupload.secure_url
    }
})

const jojo=await jo.save();
 
res.status(200).json({status:true,message:"Application Posted",jojo});

}
catch(err){
    next(err);
}

}
// {
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "phone": 1234567890,
//     "address": "123 Main St, City, Country",
//     "coverletter": "This is my cover letter for the job application.",
//     "JobId":"65cbccd84b69136e509990dd"
//   }
module.exports={JobSeekDel,ApplAllJobs,empGetAllJob,CreateApplication};