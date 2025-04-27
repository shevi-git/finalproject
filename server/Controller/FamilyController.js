const Family = require('../Models/Family');

const getAllFamilies = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const families = await Family.find();
        if (!families) {
            return res.status(404).json({ message: "families not found" });
        }
        res.json({ families });
    } catch (error) {
        console.error("Error in getAllFamilies function:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getAllFamilies };
