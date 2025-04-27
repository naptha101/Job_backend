const SendExpertMail = require("../Mailer/ExpertMail");
const User = require("../Models/User");

const SendExpert=async (req,res,next)=>{
    try{
        const email=req.body.email;
        const UserId=req.body.User;
      //  console.log('hello')
console.log(req.body.expert);
    
 const data=await SendExpertMail({email,mailType:"Expert",UserId})
 
if(data){
    const expert = await User.findById(req.body.ExpId);
    //console.log(expert)
    if (!expert) {
        return res.status(200).json({ status: false, message: "Expert not found" });
    }
    if (!expert.expertDes.clients.includes(UserId)) {
        expert.expertDes.clients.push(UserId);
        await expert.save();
        console.log(expert);
    }
    return res.status(200).json({status:true,message:"Mail Send Succesfully"})
}
return res.status(500).json({status:false,message:"Cant Send Succesfully"})
    }
    catch(err){
        return res.status(500).json({status:false,message:"Cant Send Succesfully"})
        next(err);
    }
} 

module.exports= SendExpert;