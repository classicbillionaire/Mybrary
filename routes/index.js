const express = require('express')
const router = express.Router()
const Student = require('../models/student')

router.get('/', async (req, res) => {
    let students
    try {
        students = await Student.find().limit(100).exec()
    } catch {
        students = []
    }
    res.render('index', { students: students})
})

module.exports = router