
const nodemailer=require('nodemailer');

const SendExpertMail=async ({email,mailType,UserId})=>{
    try{
  console.log(email+" "+mailType+" "+UserId);
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
    subject:mailType==="Expert"?"New Client for consultancy":"Password Change Mail",
    html:`<p>Click: <a href=${mailType==='Expert'?"http://localhost:5173/userprofile/"+UserId:""}>Here</a>
    to ${mailType==='Expert'?"Get in Contact with new client":"Get in Contact with client"}
    </p>`
  }
  const mail=await transport.sendMail(mailoption)
 console.log(mail);
if(mail){ 
    return true;
}
    }
    catch(err){
        console.log(err);
    return false;
    }
}

module.exports=SendExpertMail;