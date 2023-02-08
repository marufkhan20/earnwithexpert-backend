const router = require("express").Router();
const {
  createNewExpertProfileController,
  getAllExpertProfilesController,
  hireNewExpertController,
  getAllHireExpertsController,
  getAllHireExpertsByUserController,
  updateHireExpertStatusController,
} = require("../controllers/expertProfileController");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");
const checkAuth = require("../middlewares/authMiddleware");

// get all expert profiles
router.get("/", getAllExpertProfilesController);

// get all hire experts
router.get("/hire-experts", checkAdminAuth, getAllHireExpertsController);

// get all hire experts user
router.get("/hire-experts/:id", checkAuth, getAllHireExpertsByUserController);

// create new expert profile
router.post("/", checkAdminAuth, createNewExpertProfileController);

// hire expert
router.post("/hire-expert", checkAuth, hireNewExpertController);

// update hire expert status
router.patch(
  "/hire-expert/:id",
  checkAdminAuth,
  updateHireExpertStatusController
);

module.exports = router;
