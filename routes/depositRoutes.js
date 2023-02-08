const router = require("express").Router();
const {
  getAllDepositsController,
  createNewDepositController,
  approveDepositController,
} = require("../controllers/depositController");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");
const checkAuth = require("../middlewares/authMiddleware");

// get all deposits
router.get("/", checkAdminAuth, getAllDepositsController);

// create new deposit
router.post("/", checkAuth, createNewDepositController);

// approve deposit
router.patch("/approve/:id", checkAdminAuth, approveDepositController);

module.exports = router;
