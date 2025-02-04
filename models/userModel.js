const mongoose=require("mongoose");
const {Schema}=mongoose;
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        select:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true});


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})


userSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },  
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};



module.exports=mongoose.model("User",userSchema);