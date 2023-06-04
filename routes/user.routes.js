'use strict'


const express = require('express')
const router = express.Router();
const checkJWTAuth = require('../middlewares/jwtAuth')
const {
    userList,
    userCreate,
    storeUser,
    deleteAUser,
    userEditView,
    userView,
    updateUser } = require('../controllers/users/user.controller')

router.get('/users', checkJWTAuth, userList);
router.get('/create', checkJWTAuth, userCreate);
router.get('/edit/:id', checkJWTAuth, userEditView);
router.get('/view/:id', checkJWTAuth, userView);
router.post('/store', checkJWTAuth, storeUser);
router.post('/update/:id', checkJWTAuth, updateUser);
router.post('/delete/:id', checkJWTAuth, deleteAUser)

module.exports = router;