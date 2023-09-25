"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const upload = require("../middlewares/imageUpload");
const {
  userList,
  userCreate,
  storeUser,
  deleteAUser,
  userEditView,
  userView,
  updateUser,
} = require("../controllers/users/user.controller");

router.get("/users", checkPassportAuth, userList);
router.get("/create", checkPassportAuth, userCreate);
router.get("/edit/:id", checkPassportAuth, userEditView);
router.get("/view/:id", checkPassportAuth, userView);
router.post("/store", checkPassportAuth, upload.single("profile_image"), storeUser);
router.post("/update/:id", checkPassportAuth, updateUser);
router.post("/delete/:id", checkPassportAuth, deleteAUser);

module.exports = router;
