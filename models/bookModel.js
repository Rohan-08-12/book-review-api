const mongoose=require('mongoose');
const {Schema}=mongoose;

const bookSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    genre:{
        type:String,
        required:true,
        trim:true,
        enum: ["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery", "Romance"]
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    imageUrl:{
        type:String,
        // required:true,
        trim:true
    }
},{timestamps:true});

module.exports=mongoose.model('Book',bookSchema);
