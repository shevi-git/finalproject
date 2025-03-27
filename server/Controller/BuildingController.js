const Building=require("../Moduls/Building");



async function createBuilding(req, res) {


    const newBuilding = req.body//  מה שקיבלנו בפוסטמן 
    let Building1 = await new Building(newBuilding)// יוצר בדטהבייס אוביקט מסוג חיה 
    await Building1.save()// שומר אותו בדטהבייס
    res.send(Building1)

}
module.exports={createBuilding};