var express = require('express');
var router = express.Router();
const userController = require("./user_controller");

router.post("/registeruser", userController.userRegister);

router.post("/loginuser", userController.userLogin);
 
module.exports = router;
