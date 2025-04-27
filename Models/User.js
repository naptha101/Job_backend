const express=require("express");
const mongoose=require("mongoose");
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt = require("jsonwebtoken");
const schema=new mongoose.Schema({
username:{
    type:String,
    required:[true,"Please Enter your Email"],
    minLength:[3,"Enter min 3"],
    maxLength:[30,"Max Length is 30"]
},
email:{ 
    type:String,
    required:true,
  validate:[validator.isEmail,"Please enter Valid Email"],
    unique:true
},
phone:{
  type:Number,
  required:true
}
, 
password:{
    type:String,
    required:true,
    minLength:[8,"Minimum length is 8"],
    select:false
},
role:{
  type:String,
  required:[true,"enter Role"],
  enum:["Job seeker","Employer","Expert"]
},
createdAt:{
  type:Date,
  default:Date.now
}
,profile:{
  public_id:{
    type:String,
    
  },
  url:{
    type:String,
    
  }
},
expertDes:{
experience:{
  type:String,
  default:"0"
},
free:{
  type:Boolean,
  default:true
},
fees:{
  type:Number,
  default:0
},
clients: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user' // Referring to the 'user' model/schema
}]

},
profileSet:{
  type:Boolean,
  default:false
},
resume:{
  type:String,
  default:""
},
isResume:{
  type:Boolean,
  default:false
},
isVerified:{
  type:Boolean,
  default:false
}
,forgotPasswordToken: String,
forgotPasswordTokenExpiry: Date,
verifyToken: String,
verifyTokenExpiry: Date

});
schema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

schema.methods.comparePassword=async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}
schema.methods.getJwtToken=async function (){
  return await jwt.sign({id:this._id,},"secret",{expiresIn:"3d"}) 
}

module.exports=mongoose.model("user",schema);