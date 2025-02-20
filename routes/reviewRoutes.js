const express=require('express');
const reviewRouter=express.Router();
const {authMiddleware}=require('../middleware/authMiddleware');
const {addReview,getReview,updateReview,deleteReview}=require('../controllers/reviewController');
const {validateReview}=require('../middleware/validateReview');

// api to add review
reviewRouter.post('/:bookId',authMiddleware,validateReview,addReview)

// api to get a review
reviewRouter.get('/:bookId',authMiddleware,getReview)

// api to update a review
reviewRouter.put('/:bookId/:reviewId',authMiddleware,validateReview,updateReview)

// api to delete a review
reviewRouter.delete('/:bookId/:reviewId',authMiddleware,deleteReview)

module.exports=reviewRouter;