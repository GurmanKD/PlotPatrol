const express = require('express');
const { verifyLogIn } = require('../Controllers/AdminController');
const { isAdmin } = require('../Middlewares/AdminProtect');

const AdminRouter = express.Router();



// Verify
AdminRouter
.route('/verify')
.get(isAdmin,verifyLogIn)





module.exports=AdminRouter;