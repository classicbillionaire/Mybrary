const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const Lab = require('../models/lab')
//const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

//All
router.get('/', async (req, res) => {
    let query = Student.find()
    if (req.query.name != null && req.query.name != '') {
      query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    /*if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }*/
    try {
      const students = await query.exec()
      res.render('students/index', {
        students: students,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })

//New
router.get('/new', async (req, res) => {
    renderNewPage(res, new Student())
  })

//Create
router.post('/', async (req, res) => {
    const student = new Student({
      name: req.body.name,
      lab: req.body.lab,
      //publishDate: new Date(req.body.publishDate),
      //pageCount: req.body.pageCount,
      description: req.body.description
    })
    //saveCover(book, req.body.cover)
  
    try {
      const newStudent = await student.save()
      res.redirect(`students/${newStudent.id}`)
    } catch {
      renderNewPage(res, student, true)
    }
  })

//show student route
router.get('/:id', async (req, res) => {
    try{
        const student = await Student.findById(req.params.id)
                                .populate('lab')
                                .exec()
        res.render('students/show', { student: student})
    } catch {
        res.redirect('/')
    }
})

//edit
router.get('/:id/edit', async (req, res) => {
    try{
        const student = await Student.findById(req.params.id)
        renderEditPage(res, student)
    } catch {
        res.redirect('/')
    }
})

//update
router.put('/:id', async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id)
        student.name = req.body.name
        student.lab = req.body.lab
        //book.publishDate = new Date(req.body.publishDate)
        //book.pageCount = req.body.pageCount
        student.description = req.body.description
        /*if (req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }*/
        await student.save()
        res.redirect(`/students/${student.id}`)
    } catch {
       if (student != null){
           renderEditPage(res, student, true)
       } else {
           res.redirect('/')
       }
    }
})

//delete
router.delete('/:id', async (req, res) => {
    let student
    try{
        student = await Student.findById(req.params.id)
        await student.remove()
        res.redirect('/students')
    } catch {
        if (student != null) {
            res.render('students/show', {
                student: student,
                errorMessage: 'Could not delete the student'
            })
        } else {
            res.redirect('/')
        }
    }
})
async function renderNewPage(res, student, hasError = false) {
    renderFormPage(res, student, 'new', hasError)
}    

async function renderEditPage(res, student, hasError = false) {
   renderFormPage(res, student, 'edit', hasError)
}    

async function renderFormPage(res, student, form, hasError = false) {
    try {
        const labs =await Lab.find({})
        const params = {
            labs: labs,
            student: student
        }
        if (hasError){
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Student'
            } else {
                params.errorMessage = 'Error Adding Student'
            }
        }
        res.render(`students/${form}`, params)      
    } catch {
        res.redirect('/students')
    }
}   

/*function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }

}*/

module.exports = router