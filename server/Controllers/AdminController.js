const jwt=require('jsonwebtoken');
const Secret_key=process.env.Secret_key;


module.exports.verifyLogIn = async function verifyLogIn(req, res) {
    try {
      res.json({
        status: true,
        message: "LOGGED IN",
      });
      
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: false,
      });
    }
  };
  
  