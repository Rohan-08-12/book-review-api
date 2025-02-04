const jwt=require('jsonwebtoken')

module.exports.authMiddleware=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token provided"
            })
        }else{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
            next();
        }
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"User is not authorized"
        })
    }
}

module.exports.adminMiddleware=async(req,res,next)=>{
    try{
        console.log(req.user);
        if(req.user.role!=='admin'){
            return res.status(403).json({
                success:false,
                message:"User is not admin"
            })
        }
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"admin error"
        })
    }
}
