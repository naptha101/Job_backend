const Job =require('../Models/Job');
const jwt=require('jsonwebtoken')
const User=require('../Models/User');
const { createClient } = require('redis');





 const GetAllJob=async (req,res,next)=>{
try{
 const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect(); 
})();
  const {id2}=req.body;
  if(id2){
    const jobs=await Job.find({postedBy:id2});
    res.status(200).json({status:true,jobs});
  }else{
    const cachedData = await redisClient.get('jobs');
    
    if(cachedData){
   //   console.log(cachedData)
      return res.status(200).json({status:true,jobs:JSON.parse(cachedData)})
    }

    const jobs=await Job.find({expired:false});
    await redisClient.set("jobs",JSON.stringify(jobs))
res.status(200).json({status:true,jobs});
  }

}
catch(err){
    next(err);
}

}
const postJob=async (req,res,next)=>{
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
 const { title,
description,
category,
country,
city,
location,
fixedSalary,
salaryFrom,
salaryTo,
}=req.body;
//res.json(req.body)
if(!title||!description||!country||!city||!location||!category){
    return res.status(500).json({status:false,message:"Data insufficient"});     
}
if((!salaryTo||!salaryFrom)&&!fixedSalary){
   return res.status(500).json({status:false,message:"Data insufficient"});  
}
if(salaryFrom&&salaryTo&&fixedSalary){
    return res.status(500).json({status:false,message:"Only need to provide one field"});  
}
//res.status(200).json(req.body);
const job=new Job({
    title,
description,
category, 
country,
city,
location,
fixedSalary,
salaryFrom,
salaryTo,
postedBy:id
})
await job.save();
res.status(200).json({status:true,message:"Job Created",job})

} 
catch(err){
    next(err);
}

}
const GetMyJobs=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        
        const ver= jwt.verify(token,"secret");
         if(!ver){
         return res.status(500).json({status:false,message:"Cant fetch token"});
         }
         const id=ver.id;
         const user=await User.findById({_id:id});
       if(!user){
         return res.status(500).json({status:false,message:"User not found failed"});  
       }
    //    if(user.role==="Job seeker"){
    //       res.status(500).json({status:false,message:"Seeker Cannot Post"})
    //    }
      const jobs= await Job.find({postedBy:id,expired:false});
      res.status(200).json({status:true,message:"Your Jobs",jobs}) 

    }
    catch(err){
        next(err);
    }
}
const updataJob=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    const ver= jwt.verify(token,"secret");
     if(!ver){
     return res.status(500).json({status:false,message:"Cant fetch token"});
     }
     const id1=ver.id;
     const user=await User.findById({_id:id1});
     if(!user){
        return res.status(500).json({status:false,message:"User not found failed"});  
      }
      const {id}=req.params;
      const findJ=await Job.findById({_id:id});
      if(!findJ){
        return res.status(404).json({status:false,message:"Job not found failed"});  
      }
   
  const updt=await Job.findByIdAndUpdate(id,req.body,{new:true,runValidators:true,useFindAndModify:false});

  res.status(200).json({status:false,message:"Your Updated Jobs",updt})

}
catch(err){
next(err);
}

}
const updataCount=async (req,res,next)=>{
  try{
      const {token}=req.cookies;
      const ver= jwt.verify(token,"secret");
       if(!ver){
       return res.status(500).json({status:false,message:"Cant fetch token"});
       }
       const id1=ver.id;
       const user=await User.findById({_id:id1});
       if(!user){
          return res.status(500).json({status:false,message:"User not found failed"});  
        }
        const {id}=req.params;
        const findJ=await Job.findById({_id:id});
        if(!findJ){
          return res.status(404).json({status:false,message:"Job not found failed"});  
        }
     
    const updt=await Job.findByIdAndUpdate(id,{count:findJ.count+1},{new:true,runValidators:true,useFindAndModify:false});
  
    res.status(200).json({status:false,message:"Your Updated Jobs",updt})
  
  }
  catch(err){
  next(err);
  }
  
  }
const Delete=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        const ver= jwt.verify(token,"secret");
         if(!ver){
         return res.status(500).json({status:false,message:"Cant fetch token"});
         }
         const id1=ver.id;
         const user=await User.findById({_id:id1});
         if(!user){
            return res.status(500).json({status:false,message:"User not found failed"});  
          }
          const {id}=req.params;
          const findJ=await Job.findById({_id:id});
          if(!findJ){
            return res.status(404).json({status:false,message:"Job not found failed"});  
          }
          const del=await Job.findByIdAndDelete({_id:id});

          res.status(200).json({status:false,message:"Your Job deleted",del})
    }
    catch(err){
        next(err);
    }
}
const getSingle=async (req,res,next)=>{
  try{
const {id}=req.params
const job=await Job.findById({_id:id});
if(job){
  res.status(200).json({status:true,message:"Job found",job});
}else{
res.status(404).json({status:false,message:"Job not found"})}

  }catch(err){
    next(err);
  }
}

module.exports={GetAllJob,postJob,GetMyJobs,updataJob,Delete,getSingle,updataCount}