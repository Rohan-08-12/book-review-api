const mongoose=require('mongoose');
const express=require('express');
const userRouter=express.Router();
const User=require('../models/UserModel');

const registerUser = async(req,res,next)=>{
    const {username,email,password , role}=req.body;
    try{
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }else{
            const user=await User.create({
                username,
                email,
                password,
                role
            })
            return res.status(200).json({
                success:true,
                message:"User registered successfully",
                user
            })
        }
    }catch(err){
        next(err);
    }
}

const loginUser=async (req, res,next    ) => {
    const { email, password } = req.body; 

    try {
        const user = await User.findOne({ email }).select("+password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = user.generateToken();

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                username: user.username,
                email:user.email,
                role:user.role
            },
            token
        }); 

    } catch (err) {
        next(err);
    }
}

const logoutUser=async (req, res,next) => {
    try {
        
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (err) {
        next(err);
    }
}


module.exports={registerUser,loginUser,logoutUser};