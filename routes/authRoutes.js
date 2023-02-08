const {
  addNewUserController,
  loginController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/register", addNewUserController);

router.post("/login", loginController);

module.exports = router;
