const router = require('express').Router()
const {movController} = require('../controller')

router.get('/get/all', movController.getAll)
router.get('/get', movController.get)
router.post('/add', movController.add)
router.patch('/edit/:id', movController.edit)
router.patch('/set/:id', movController.set)

module.exports = router

