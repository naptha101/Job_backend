const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Enter JobTitle"],
        minLength: [3, "Enter min 3"],
        maxLength: [30, "Max Length is 30"]
    },
    description: {
        type: String, // <-- Corrected typo here (changed 'tyoe' to 'type')
        required: [true, "Enter Description"],
        minLength: [3, "Enter min 3"],
        maxLength: [1000, "Max Length is 350"]
    },
    category: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    fixedSalary: {
        type: Number,
        
    },
    salaryFrom: {
        type: Number,
        
    },
    salaryTo: {
        type: Number,
       
    },
    expired: {
        type: Boolean,
        default: false
    },
    JobPostedOn: {
        type: Date,
        default: Date.now()
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    count:{
      type:Number,
      default:0  
    }
}, { timestamps: true });

module.exports = mongoose.model("Job", schema); 
