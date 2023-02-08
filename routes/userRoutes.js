const {
  getUserByUserIdController,
  updateProfilePicController,
  getAllUsersController,
  deleteUserController,
  playGameController,
} = require("../controllers/userController");
const checkAuth = require("../middlewares/authMiddleware");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");
const router = require("express").Router();

// get all users
router.get("/", checkAdminAuth, getAllUsersController);

// get single user
router.get("/:id", checkAuth, getUserByUserIdController);

// update user profile
router.patch("/update-profile-pic/:id", checkAuth, updateProfilePicController);

// update your balance
router.patch("/play-game/:id", checkAuth, playGameController);

// delete user
router.delete("/:id", checkAdminAuth, deleteUserController);

module.exports = router;
