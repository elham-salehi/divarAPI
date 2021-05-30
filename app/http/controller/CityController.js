const CityModel = require('../../models/City');

class CityController {
    async getAll (req,res){
        try{
            const list = await CityModel.find();
            res.send(list);
        }
        catch(err){
            console.log(err)
        }
    };
}

module.exports = new CityController();