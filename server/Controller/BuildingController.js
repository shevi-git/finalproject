const Building=require("../Moduls/BuildingSchema");



async function createBuilding(req, res) {
    try {
        const newBuilding = req.body;
        let building1 = new Building(newBuilding);
        await building1.save();
        res.status(201).json(building1);
    } catch (error) {
        res.status(500).json({ message: "Error creating building", error });
    }
}

module.exports={createBuilding};