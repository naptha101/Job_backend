const express=require('express')
const router=express.Router();
     const jwt=require('jsonwebtoken')    
     const {getAllExpert,Register,Login,logout,GetUser,getBy,updateUser,ForgotPassword,HandleForgot,setResume,updateProfil,VerifyMail} =require('../Controller/UserController') 
     // {
  
     //      "email":"yaash.as34333@gmail.com",
     //      "password":"Heslllo123",
     //      "role":"Job seeker"
          
     //    } 
// router.post('/register',async (req,res,next)=>{
//     try {
       
//       const header=req.headers.authorization;
//       if(header){
//         // res.send(header);
//       const decoded = jwt.verify(header, 'secret');
//       if(decoded){
//         res.status(200).json({message:"Token is Valid"})
//       }
//         res.status(401).json({message:"it's invalid, return a 401 Unauthorized status"})
//       }else{
//         res.status(401).json({message:"it's invalid, return a 401 Unauthorized status"})
//       }
//         }
//         catch(err){
//           next(err);
//         }

//               }        )

router.post('/register',Register);
router.post('/login',Login)
router.get('/logout',logout);
router.get('/getuser',GetUser);
router.get('/getby/:id',getBy);
router.put('/update/:id',updateUser);
router.post('/setresume/:id',setResume);
router.post('/verifymail',VerifyMail);
router.post('/setprofile',updateProfil);
router.post('/forgotpassword',ForgotPassword)
router.put('/handleforgot',HandleForgot);
router.get('/expert/all',getAllExpert);
// const ipRequestCounts = {};
// router.get('/check',async (req,res,next)=>{
//      const rateLimit = 5; 
//      const windowMs = 60 * 1000; 
//      const ip = req.ip 
//      if (!ipRequestCounts[ip]) {
//        ipRequestCounts[ip] = [{ timestamp: Date.now(), count: 1 }];
//      } else {  
//        ipRequestCounts[ip] = ipRequestCounts[ip].filter(
//          (record) => record.timestamp + windowMs > Date.now()
//        );
//        ipRequestCounts[ip].push({ timestamp: Date.now(), count: 1 });
//      }
//      if (ipRequestCounts[ip].length > rateLimit) {
     
//        return res.status(429).send('Too Many Requests');
//      }   
//      res.send("User May Proceed")

// })
module.exports=router