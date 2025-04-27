const User=require('../Models/User');
const nodemailer=require('nodemailer');
const bycrypt=require('bcryptjs');
const SendMail=async ({email,mailType,UserId})=>{
    try{
const hashed=await bycrypt.hash(UserId.toString(),10);
if(mailType=="verify"){
    await User.findByIdAndUpdate(UserId,{verifyToken: hashed,
        verifyTokenExpiry: Date.now()+3600000},{new:true});
}else{
    await User.findByIdAndUpdate(UserId,{forgotPasswordToken: hashed,
        forgotPasswordTokenExpiry: Date.now()+3600000},{new:true});
}
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const mailoption={
    from:"yashverma2121212121@gmail.com",
    to:email,
    subject:mailType==="verify"?"Verification Mail":"Password Change Mail",
    html:`<p>Click: <a href=${mailType==='verify'?"http://localhost:5173/verifyemail?="+hashed:"http://localhost:5173/forgotpassword?="+hashed}>Here</a>
    to ${mailType==='verify'?"Verify Your Mail":"Change Password by verification"}
    </p>`
  }
  const mail=await transport.sendMail(mailoption)
 
if(mail){ 
    return true;
}
    }
    catch(err){
        console.log(err);
    return false;
    }
}

module.exports=SendMail;