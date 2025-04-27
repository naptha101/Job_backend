const express=require("express");
const mongoose=require("mongoose");
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt = require("jsonwebtoken");
const schema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please Enter your Email"],
    minLength:[3,"Enter min 3"],
    maxLength:[30,"Max Length is 30"]
},
email:{
    type:String,
    required:true,
  validate:[validator.isEmail,"Please enter Valid Email"],
   
},
phone:{
  type:Number,
  required:true
}
, 
address:{
  type:String,
 required:true
},
coverletter:{
    type:String,
    required:true,
    minLength:[8,"Minimum length is 8"],
    
},
resume:{
  public_id:{
    type:String,
    required:true
  },
  url:{
    type:String,
    required:true
  }

},
ApplicantId:{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  role:{
    type:String,
    enum:["Job seeker"]
  }
}
,
employerId:{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  role:{
    type:String,
    enum:["Employer"]
  }

}
},{timestamps:true});
// schema.pre("save", async function(next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// schema.methods.comparePassword=async function (enteredPassword){
//   return await bcrypt.compare(enteredPassword,this.password);
// }
// schema.methods.getJwtToken=async function (){
//   return await jwt.sign({id:this._id,},"secret",{expiresIn:"3d"})
// }

module.exports=mongoose.model("Application",schema);