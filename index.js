const express=require('express')
const app=express();
const dotenv=require('dotenv');
const mongoose=require('mongoose')
const userRouter=require('./Route/UserRoute');
const cookieParse=require('cookie-parser')
dotenv.config();
const bcrypt=require('bcryptjs')
const stripe=require("stripe")(`${process.env.STRIPE_KEY}`);
const fileUpload=require("express-fileupload");
const cloudinary=require('cloudinary').v2;
const cors=require('cors');
const uuid=require('uuid').v4;
const jobRouter=require('./Route/JobRoute')

const ExpertRouter=require('./Controller/ExpertController')
//const socket=require('socket.io');
const cookieParser = require('cookie-parser');
const ApplicationRouter=require('./Route/Applicationroute');          
cloudinary.config({ 
  cloud_name: 'dneeum0v1', 
  api_key: '951164984623356', 
  api_secret: 'YC86zF3N1b5Ue0EhxX5GjK2SoOg' 
});
const connect=async()=>{
  console.log(process.env.MONGO_CON)
    try{
    await mongoose.connect(`${process.env.MONGO_CON}`).then(
console.log("connected")

    )
}catch(err){
        console.log(err);
    }
}
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Reflect request origin
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Enable preflight requests for all routes
app.options('*', cors());
app.use(fileUpload({useTempFiles:true}))
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({extended:true}))
dotenv.config();
// Endpoint to handle payments
app.post('/payment', async (req, res) => {
  try {   
    //console.log(process.env.STRIPE_KEY)
    const { expert } = req.body;
 
console.log(expert);
const idHAsh=await bcrypt.hash(expert.id,10);
    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: expert.name,
            },
            unit_amount: expert.price * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONT_URL}/success/expert/`+expert.id, // Redirect URL after successful payment
      cancel_url: `${process.env.FRONT_URL}/cancel/expert`, // Redirect URL after canceled payment
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Endpoint to send email




app.use("/api/auth",userRouter);
app.use("/api/jobs",jobRouter)
app.use('/api/application',ApplicationRouter);
app.use('/api/',ExpertRouter)
dotenv.config();
const server=app.listen(8000,()=>{
    connect();
    console.log("helllo"+8000);  
})  
// const io=socket(server,{
//     cors:{ 
//       origin:"http://localhost:5173/",
//       Credential:true
  
//     }
//   })
//   global.onlineUsers=new Map();
//   io.on("connection",(socket)=>{
//     global.chatSocket=socket;
//     socket.on("add-user",(user Id)=>{ 
//       console.log(userId);
//       onlineUsers.set(userId,socket.id);
//     })
//     socket.on("send-msg",(data)=>{
//       const sendUserSocket=onlineUsers.get(data.to);
//       console.log(sendUserSocket);
//       if(sendUserSocket){
  
//         socket.to(sendUserSocket).emit("msg-recieved",{message:data.msg,isImageSet:data.isImage,Image:data.Image,updatedAt:data.updatedAt});
//       }
  
//     })
  
//   })