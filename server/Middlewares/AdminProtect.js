const jwt=require('jsonwebtoken');
const AdminModel = require('../Models/AdminModel');
const Secret_key=process.env.Secret_key;


module.exports.isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            let payload = jwt.verify(token, Secret_key);
            if (payload){
                let user=await AdminModel.findOne({username:payload.username});
                if(user){
                    if(user.password===payload.password){
                        req.user=user;
                        next();
                    }
                    else{
                        throw new Error("Invalid Password");
                    }
                }
                else{
                    throw new Error("User does not exists.");
                }
            } else {
                throw new Error("Invalid Credentials");
            }
        } else {
            throw new Error("Authorization header missing or malformed");
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false
        });
    }
};