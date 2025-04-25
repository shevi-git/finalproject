const familySchema=require("../Moduls/familySchema");

async function createFamily(req, res) {
    try {
        const newfamily = req.body;
        let family1 = new familySchema(newfamily);
        await family1.save();
        res.status(201).json(family1);
    } catch (error) {
        res.status(500).json({ message: "Error creating building", error });
    }
}

const updateFamily = async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.body) {
        return res.status(400).json({ message: "No update data provided" });
      }
  
      // בודקים אילו שדות מותר לעדכן
      const allowedFields = [
        "nameFamily",
        "floor",
        "electricity",
        "water",
        "amountChildren",
        "type",
        "role",
      ];
  
      const updates = {};
      for (let field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
  
      // אין שדות לעדכן אחרי סינון
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
  
      const updatedFamily = await Family.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
  
      if (!updatedFamily) {
        return res.status(404).json({ message: "Family not found" });
      }
  
      res.json({ message: "Family updated successfully", family: updatedFamily });
    } catch (err) {
      console.error("Error updating family:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

async function deleteFamily(params) {
    
}

const getAllFamilies = async (req, res) => {
  try {
      // אין צורך לבדוק את req.body כי אנחנו רוצים את כל המשפחות
      const families = await familySchema.find().lean().exec();
      
      if (!families || families.length === 0) {
          return res.status(404).json({ message: "No families found" });
      }

      // מחזירה את כל המשפחות
      return res.status(200).json(families);
      
  } catch (error) {
      console.error("Error in getAllFamilies function:", error);
      return res.status(500).json({ message: "Server error" });
  }
}



module.exports={createFamily,updateFamily,deleteFamily,getAllFamilies};