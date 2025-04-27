const express=require("express")
const router=express.Router();
const {GetAllJob,postJob,GetMyJobs,updataJob,Delete,getSingle,updataCount} =require('../Controller/JobController')
router.get('/getall',GetAllJob);
router.post('/getallfor',GetAllJob);
router.post('/post',postJob);
router.get('/myjobs',GetMyJobs);
router.put('/update/:id',updataJob);
router.delete('/delete/:id',Delete);
router.get('/:id',getSingle);
router.put('/updcount/:id',updataCount);
module.exports=router;