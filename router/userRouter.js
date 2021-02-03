const router = require('express').Router()
const {userController} = require('../controller')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.patch('/deactive', userController.deactiveAcc)
router.patch('/close', userController.closeAcc)
router.patch('/activate', userController.ActiveAcc)

module.exports = router