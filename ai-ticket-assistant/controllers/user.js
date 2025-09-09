import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import moderatorAndEndUser from "../models/moderatorAndEndUser.js"
import {inngest} from "../inngest/client.js"

export const signup=async(req,res)=>{
    const {email,password,skills=[],domain}=req.body
    try{
        const hashed=await bcrypt.hash(password,10)
        const user= await User.create({email,password:hashed,skills,role:"admin",domain})
        const secureuser=await User.findById(user._id).select('-password');

        //fire inngest event
        await inngest.send({
            name:'user/signup',
            data:{
                email
            }
        });

        const token=secureuser.generateAccessToken();
             const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken",token,options)
        .json(secureuser)

    }
    catch(error){
       res.status(500).json({error:"Signup failed",details:error.message})
    }
}

export const signupModeratorandEndUser=async(req,res)=>{
    const {email,password,isModerator,domain}=req.body;
    //console.log(req.body)
    try{
        const hashed=await bcrypt.hash(password,10)
        const userCheck=await moderatorAndEndUser.findOne({email,domain})
        if(userCheck)
        {
            return res.json({error:"User already exist"});
        }
        const user= await moderatorAndEndUser.create({email,password:hashed,role:isModerator?"moderator":"user",domain});
        const secureuser=await moderatorAndEndUser.findById(user._id).select('-password');

        //fire inngest event
        if(isModerator)
        {await inngest.send({
            name:'user/signup',
            data:{
                email
            }
        });
        }

        const accessToken=secureuser.generateAccessToken();
             const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken",accessToken,options)
        .json(secureuser)

    }
    catch(error){
       res.status(500).json({error:"Signup failed",details:error.message})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email})
        if(!user) return res.status(401).json({error:"User not found"})
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid Credentials"})
        }
        const secureuser=await User.findById(user._id).select('-password');
        const accessToken=secureuser.generateAccessToken();
             const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken",accessToken,options)
        .json(secureuser)
    }
    catch(error){
       res.status(500).json({error:"Login Failed",details:error.message});
    }
}

export const loginModeratorAndEndUser=async(req,res)=>{
    const {email,password,domain}=req.body;
    try{
        const user=await moderatorAndEndUser.findOne({email,domain})
        if(!user) return res.status(401).json({error:"User not found"})
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid Credentials"})
        }
        const secureuser=await moderatorAndEndUser.findById(user._id).select('-password');
        const accessToken=secureuser.generateAccessToken();
             const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken",accessToken,options)
        .json(secureuser)
    }
    catch(error){
       res.status(500).json({error:"Login Failed",details:error.message});
    }
}


export const logout = async(req,res)=>{
    try{
const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
res.status(200)
.clearCookie("accessToken", options)
.json({message:"Logout Successfully"})
    }
    catch(error){
     res.status(500).json({error:"Login Failed",details:error.message});
    }
}


export const updateUser = async(req,res)=>{
    const {skills=[],role,email,domain}=req.body
    try{
        if(req.user?.role!=="admin"){
            return res.status(403).json({error:"Forbidden"})
        }
        const user=await moderatorAndEndUser.findOne({email,domain});
        if(!user)
        {
            return res.status(401).json({error:"User not found"})
        }
        await moderatorAndEndUser.updateOne({email,domain},{skills:skills?.length ? skills : user.skills,role})
        return res.status(200)
        .json({message:"User updated successfully"})
    }
    catch(error){
        res.status(500).json({error:"Update Failed",details:error.message})
    }
}


export const getUsers = async (req,res)=>{
    try{
       if(req.user.role!=="admin"){
        return res.status(403).json({error:"Forbidden"})
       }
       const users=await moderatorAndEndUser.find().select("-password")
       return res.status(200).json(users)
    }catch(error){
      res.status(500).json({error:"Update failed",details:error.message});
    }
}

export const moderatorVerfication= async(req,res)=>{
    try{
      if(req.user.role!=="admin"){
        return res.status(403).json({error:"Forbidden"})
       }
       const {id}=req.body
       const user=await moderatorAndEndUser.findByIdAndUpdate(id,{isModerator:true},{new:true});
       if(!user)
       {
        return res.status(400).json({error:"No such moderator exist"})
       }
       return res.status(200).json({success:true});
    }
    catch{
      res.status(500).json({error:"Update failed",details:error.message});
    }
}

export const getunverifiedModerator=async(req,res)=>{
    try{
          const {domain}=req.body;
          const moderators=await moderatorAndEndUser.find({domain,isModerator:false});
          return res.status(200).json({moderators})

    }
    catch{
      res.status(500).json({error:"Update failed",details:error.message});
    }
}

export const getCurrentUser=async(req,res)=>{
    try{
        //console.log(req.user)
    let user={};
    if(req.user.role==='admin')
    {
       user=await User.findById(req.user._id);
       if(user)
       {
        return res.status(200).json(user)
       }
    }
    else{
      user=await moderatorAndEndUser.findById(req.user._id);
      if(user){
        return res.status(200).json(user);
      }
    }
    return res.status(400).json({error:"User not logged in"})
   }
   catch(err){
    return res.status(500).json({error:"Internal Server Error",details:err.message})
   }
}