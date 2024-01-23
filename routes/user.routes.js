"use strict";

const express = require("express");
const router = express.Router();
const { checkPassportAuth } = require("../middlewares/passportAuth");
const upload = require("../middlewares/imageUpload");
const {
  userList,
  userCreate,
  storeUser,
  deleteAUser,
  userEditView,
  userView,
  updateUser,
  verifyUser,
  updateProfile,
  userProfileView,
} = require("../controllers/users/user.controller");

router.get("/users", checkPassportAuth, userList);
router.get("/create", checkPassportAuth, userCreate);
router.get("/edit/:id", checkPassportAuth, userEditView);
router.get("/view/:id", checkPassportAuth, userView);

router.post(
  "/store",
  checkPassportAuth,
  upload.single("profile_image"),
  storeUser
);

router.post(
  "/update/:id",
  checkPassportAuth,
  upload.single("profile_image"),
  updateUser
);
router.post("/delete/:id", checkPassportAuth, deleteAUser);
router.get("/verify/:id/:token", verifyUser);

// User Profile routes
router.get("/profile/:id", checkPassportAuth, userProfileView);
router.post("/profile/update/:id", checkPassportAuth, updateProfile);

module.exports = router;
