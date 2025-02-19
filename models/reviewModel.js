const mongoose=require('mongoose');
const {Schema}=mongoose;

const reviewSchema=new Schema({
    bookId:{
        type:Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        max:50
    }
},{timestamps:true});

module.exports=mongoose.model("Review",reviewSchema);