const mongoose = require("mongoose");
const Users = require("../Moduls/UserSchema");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");

const register = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (typeof password !== 'string' || !password.trim()) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const duplicate = await Users.findOne({ email: email }).lean();
        if (duplicate) {
            return res.status(409).json({ message: "Existing user" });
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const userObject = { name, email, password: hashedPwd };

        const user = await Users.create(userObject);
        if (user) {
            // יצירת טוקן JWT
            const accessToken = jwt.sign(
                { name: user.name, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' } // הגדרת זמן תפוגה של הטוקן
            );

            return res.status(201).json({
                message: `New user ${user.name} created`,
                accessToken: accessToken, // מחזירים את הטוקן ללקוח
            });
        } else {
            return res.status(400).json({ message: 'Invalid user received' });
        }

    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const login = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const foundUser = await Users.findOne({ email }).lean();
        if (!foundUser) {
            return res.status(401).json({ message: 'Email address is not registered in the system' });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // יצירת טוקן JWT שמכיל את תפקיד המשתמש
        const accessToken = jwt.sign(
            { nameFamily: foundUser.nameFamily, email: foundUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // מחזירים את הטוקן בתגובה
        res.json({
            message: 'Logged In',
            accessToken: accessToken // ודא שהשם הוא accessToken
        });

    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Server error" });
    }
}


const updateUser =async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const {nameFamily,email,password,appartment,role,createdAt}=req.body;
        if (!email || !password||!nameFamily) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (typeof password !== 'string' || !password.trim()) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const duplicate = await Users.findOne({ email: email }).lean();
        if (!duplicate) {
            return res.status(409).json({ message: "user not exist" });
        }
        const hashedPwd = await bcrypt.hash(password, 10);
        const userObject = { nameFamily, email, password: hashedPwd};

       const updatedUser=await Users.findByIdAndUpdate(duplicate._id,userObject,{new:true});
       if(!updatedUser){
        return res.status(400).json({message:"user not updated"});
       }
       res.json({message:"user updated",user:updatedUser});
    }catch(error){
        console.error("Error in updateUser function:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const deleteUser=async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"email is required"});
        }
        const foundUser=await Users.findOne({email}).lean();
        if(!foundUser){ 
            return res.status(404).json({message:"user not found"});
        }
        const deletedUser=await Users.findByIdAndDelete(foundUser._id);
        if(!deletedUser){
            return res.status(400).json({message:"user not deleted"});
        }
        res.json({message:"user deleted",user:deletedUser});    
    }catch(error){      
        console.error("Error in deleteUser function:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const getUser=async(req,res)=>{
    try{
        console.log("Request body:", req.body);
    }catch(error){
        console.error("Error in getUser function:", error);
        res.status(500).json({ message: "Server error" });
    }
}  
const getAllUsers=async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const users=await Users.find();
        if(!users){
            return res.status(404).json({message:"users not found"});
        }
        res.json({users});
    }catch(error){
        console.error("Error in getAllUsers function:", error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { register, login,updateUser,deleteUser,getUser,getAllUsers };
