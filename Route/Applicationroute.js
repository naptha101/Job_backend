const express=require('express')
const router=express.Router();
const {JobSeekDel,ApplAllJobs,empGetAllJob,CreateApplication}=require('../Controller/ApplicationController')
router.get('/empApp',empGetAllJob);
router.get('/appApp',ApplAllJobs);
router.delete('/appdel/:Id',JobSeekDel);
router.post('/post',CreateApplication);
module.exports=router;