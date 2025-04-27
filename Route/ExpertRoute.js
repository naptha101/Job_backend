const express=require('express')
const router=express.Router();
import SendExpert from '../Controller/ExpertController';

router.post('/expert/send',SendExpert)
module.exports=router