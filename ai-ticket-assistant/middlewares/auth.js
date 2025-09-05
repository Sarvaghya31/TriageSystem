import jwt from "jsonwebtoken"
export const authenticate=(req,res,next)=>{
    
    const token=req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]
   // console.log(token);
    if(!token){
        return res.status(401).json({error:"Access Denied.No token found"})
    }
    try{
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    //console.log(decoded);
    req.user=decoded;
    next();
    }catch(error){
        res.status(401).json({error:"Invalid Token"})
    }
}