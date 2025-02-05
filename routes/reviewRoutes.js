const express=require('express');
const reviewRouter=express.Router();
const Review=require('../models/reviewModel');
const {authMiddleware,adminMiddleware}=require('../middleware/authMiddleware');

// api to add review
reviewRouter.post('/:bookId',authMiddleware,async(req,res)=>{
    try{
        const userID=req.user.id;
        const bookID=req.params.bookId;
        const reviewExists=await Review.findOne({user:userID,bookId:bookID});
        const {rating,comment}=req.body;
        if(reviewExists){
            return res.status(400).json({
                success:false,
                message:"You cannot add more than one review per book."
            })  
        }
        if(rating < 1 || rating > 5){
            return res.status(400).json({
                success:false,
                message:"Rating must be between 1 and 5"
            })
        }
        if(!comment || !rating ){
            return res.status(400).json({
                success:false,
                message:"Comment and rating are required"
            })
        }
        const review = await Review.create({user:userID,bookId:bookID,rating,comment});
        return res.status(200).json({
            success: true,
            message: "Review added successfully",
            review
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to add review",
            error:err.message
        })
    }
})

// api to get a review
reviewRouter.get('/:bookId',authMiddleware,async(req,res)=>{
    try{
        const bookID=req.params.bookId;
        const reviews=await Review.find({bookId:bookID}).sort({createdAt:-1}).populate('user','username email');
        if(reviews.length===0){
            return res.status(404).json({
                success:false,
                message:"No reviews found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Reviews fetched successfully",
            reviews
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch reviews",
            error:err.message
        })
    }
})

reviewRouter.put('/:bookId/:reviewId',authMiddleware,async(req,res)=>{
    try{
        const user=req.user.id;
        const reviewID=req.params.reviewId;
        const author=await Review.findById(reviewID);
        if(author.user.toString()!==user){
            return res.status(401).json({
                success:false,
                message:"You are not authorized to update this review"
            })
        }
        const {rating,comment}=req.body;
        if(rating < 1 || rating > 5){
            return res.status(400).json({
                success:false,
                message:"Rating must be between 1 and 5"
            })
        }
        if(!comment || !rating ){
            return res.status(400).json({
                success:false,
                message:"Comment and rating are required"
            })
        }
        const updatedReview = await Review.findByIdAndUpdate(reviewID, {rating, comment}, {new: true}).populate('user', 'username email');
        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to update review",
            error:err.message
        })
    }
})

// api to delete a review
reviewRouter.delete('/:bookId/:reviewId',authMiddleware,async(req,res)=>{
    try{
        const user=req.user.id;
        const reviewID=req.params.reviewId;
        const author=await Review.findById(reviewID);
        if(author.user.toString()!==user){
            return res.status(401).json({
                success:false,
                message:"You are not authorized to delete this review"
            })
        }
        if(user.role==="admin"){
            await Review.findByIdAndDelete(reviewID);
            return res.status(200).json({
                success:true,
                message:"Review deleted successfully by admin"
            })
        }
        await Review.findByIdAndDelete(reviewID);
        return res.status(200).json({
            success:true,
            message:"Review deleted successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to delete review",
            error:err.message    
        })
    }
})

module.exports=reviewRouter;