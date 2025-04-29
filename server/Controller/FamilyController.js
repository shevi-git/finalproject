const Family = require('../Moduls/familySchema');

const createFamily = async (req, res) => {
    const { nameFamily, floor, electricity, water, amountChildren, role, password } = req.body;
    try {
        const newFamily = new Family({
            nameFamily,floor,electricity,water,amountChildren,role,password
        });

        await newFamily.save();
        res.status(201).json(newFamily);
    } catch (error) {
        console.error("Error creating family:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const updateFamily = async (req, res) => {
    const { id } = req.params;
    const { nameFamily, floor, electricity, water, amountChildren, role } = req.body;

    try {
        const family = await Family.findById(id);
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }

        family.nameFamily = nameFamily || family.nameFamily;
        family.floor = floor || family.floor;
        family.electricity = electricity || family.electricity;
        family.water = water || family.water;
        family.amountChildren = amountChildren || family.amountChildren;
        family.role = role || family.role;

        await family.save();
        res.status(200).json(family);
    } catch (error) {
        console.error("Error updating family:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllFamilies = async (req, res) => {
    try {
        const families = await Family.find();
        if (!families) {
            return res.status(404).json({ message: "Families not found" });
        }
        res.status(200).json(families);
    } catch (error) {
        console.error("Error fetching families:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const getFamilyById = async (req, res) => {
    try {
        const family = await Family.findById(req.params.id);
        if (!family) return res.status(404).json({ message: 'לא נמצאה משפחה' });
        res.json(family);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error });
    }
};

module.exports = { createFamily, updateFamily, getAllFamilies, getFamilyById };

