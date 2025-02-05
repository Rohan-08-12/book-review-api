const express=require('express');
const userRouter=express.Router();
const {registerUser,loginUser,logoutUser}=require('../controllers/userController');

userRouter.post('/register',registerUser);

userRouter.post('/login', loginUser);

userRouter.post('/logout', logoutUser);

module.exports=userRouter;