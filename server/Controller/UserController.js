const mongoose = require("mongoose");
const Users = require("../Moduls/UserSchema");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");

const register = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { nameFamily, email, password, role } = req.body;
        if (!nameFamily || !email || !password) {
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
        const userObject = { 
            nameFamily, 
            email, 
            password: hashedPwd,
            role: role || 'resident' // אם לא צוין תפקיד, ברירת המחדל היא תושב
        };

        const user = await Users.create(userObject);
        if (user) {
            // יצירת טוקן JWT
            const accessToken = jwt.sign(
                { 
                    _id: user._id,
                    nameFamily: user.nameFamily, 
                    email: user.email,
                    role: user.role // הוספת התפקיד לטוקן
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: `New user ${user.nameFamily} created`,
                accessToken: accessToken,
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

        // יצירת טוקן JWT שמכיל את מזהה המשתמש ותפקידו
        const accessToken = jwt.sign(
            { 
                _id: foundUser._id,
                nameFamily: foundUser.nameFamily,
                email: foundUser.email,
                role: foundUser.role // הוספת התפקיד לטוקן
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // מחזירים את הטוקן בתגובה
        res.json({
            message: 'Logged In',
            accessToken: accessToken
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

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingUser = await Users.findOne({ email }).lean();
        res.json({ exists: !!existingUser });
    } catch (error) {
        console.error("Error in checkEmail function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        if (role !== 'resident' && role !== 'houseCommittee') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await Users.findOneAndUpdate(
            { email },
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // יצירת טוקן חדש עם התפקיד המעודכן
        const accessToken = jwt.sign(
            { 
                _id: user._id,
                nameFamily: user.nameFamily,
                email: user.email,
                role: user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Role updated successfully',
            accessToken: accessToken
        });
    } catch (error) {
        console.error("Error in updateUserRole function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { register, login, updateUser, deleteUser, getUser, getAllUsers, checkEmail, updateUserRole };
