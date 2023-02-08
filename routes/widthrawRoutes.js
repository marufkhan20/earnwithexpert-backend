const router = require("express").Router();
const {
  getAllWidthrawsController,
  createNewWidthrawController,
  approveWidthrawController,
} = require("../controllers/widthrawController");
const adminAuthCheck = require("../middlewares/adminAuthMiddleware");
const checkAuth = require("../middlewares/authMiddleware");

// get all widthraws
router.get("/", adminAuthCheck, getAllWidthrawsController);

// create new widthraw
router.post("/", checkAuth, createNewWidthrawController);

// approve widthraw
router.patch("/approve/:id", adminAuthCheck, approveWidthrawController);

module.exports = router;
