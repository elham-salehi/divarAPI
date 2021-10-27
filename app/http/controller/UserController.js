const UserModel = require('../../models/User');
const _ = require('lodash');
const {validateUser} = require('../validator/UserValidator');
let Kavenegar = require('kavenegar');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 2 * 60 * 60, checkperiod: 5 * 60 });

let api = Kavenegar.KavenegarApi({
    apikey: 'APICODE' //your api key
});

class UserController {
       async sendVerifyCode(req, res) {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).send({message: error.message});

        const number = Math.floor(Math.random() * 90000 + 10000);
           myCache.mset([
               {key: "codeNumber", val: number},
               {key: "phone", val: req.body.phoneNumber},
           ])
        api.Send({
                message:  `میتوانید از کد ${number} برای فعالسازی استفاده کنید`,
                sender: "10004346",
                receptor: 91234567890 //your phone
            },
            function(response, status) {
                console.log(response);
                console.log(status);
            });
        res.status(200).send(true);
    };
    async login(req, res) {
        if (!req.body.code) return res.status(400).send('باید یک کد بفرستید');
        const code = req.body.code;
        // const lastCode = myCache.get("codeNumber");
        const lastCode= 123456;
        if (code == lastCode) {
                 const phoneNum = myCache.get("phone");
                let user = await UserModel.findOne({ phoneNumber: phoneNum });
                if (!user) {
                    user = new UserModel({phoneNumber:phoneNum});
                    user = await user.save();
                }
                const token = user.generateAuthToken();
                res.header("Access-Control-Expose-headers","x-auth-token").header('x-auth-token', token).status(200).send(user);

        } else res.status(400).send(false);



    };
}

module.exports = new UserController();