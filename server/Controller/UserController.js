const mongoose = require("mongoose");
const Users = require("../Moduls/UserSchema");
const bcrypt = require("bcrypt");

async function register(req, res) {
    try {
        console.log("Request body:", req.body);

        const { nameFamily, email, password, role } = req.body;
        if (!nameFamily || !email || !password || !role) {
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
        const userObject = { nameFamily, email, password: hashedPwd, role };

        const user = await Users.create(userObject);
        if (user) {
            return res.status(201).json({ message: `New user ${user.nameFamily} created` });
        } else {
            return res.status(400).json({ message: 'Invalid user received' });
        }
    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const login = async (req, res) => {
    console.log("Request body:", req.body);
    const { nameFamily,email,password } = req.body


if (!nameFamily || !password||!email) {
    return res.status(400).json({ message: 'All fields are required' })
}
const foundUser = await Users.findOne({ email }).lean();
if (!foundUser) {
    return res.status(401).json({ message: 'Email address is not registered in the system' })
}
const match = await bcrypt.compare(password, foundUser.password);
if (!match) return res.status(401).json({ message: 'Incorrect password' })
res.send("Logged In")
}

module.exports = { register, login };
