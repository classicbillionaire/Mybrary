const express = require('express')
const router = express.Router()
const Lab = require('../models/lab')
const Student = require('../models/student')



//All
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const labs = await Lab.find(searchOptions)
        res.render('labs/index', { 
            labs: labs,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }    
})

//New
router.get('/new', (req, res) => {
    res.render('labs/new',{ lab: new Lab() })
})

//Create
router.post('/', async (req, res) => {
    const lab = new Lab({
        name: req.body.name
    })
    try{
        const newLab = await lab.save()
        res.redirect(`labs/${newLab.id}`)
    } catch {
        res.render('labs/new', {
              lab: lab,
              errorMessage: 'Error creating Lab'
    })    
}
})

router.get('/:id', async (req, res) => {
    try {
        const lab = await Lab.findById(req.params.id)
        const students = await Student.find({ lab: lab.id}).limit(6).exec()
        res.render('labs/show', {
            lab: lab,
            studentsByLab: students
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const lab = await Lab.findById(req.params.id)
        res.render('labs/edit',{ lab: lab })
    } catch { 
        res.redirect('/labs')
    }
})
router.put('/:id',async (req, res) => {
    let lab
    try{
        lab = await Lab.findById(req.params.id)
        lab.name = req.body.name
        await lab.save()
        res.redirect(`/labs/${lab.id}`)
    } catch {
        if (lab == null) {
            res.redirect('/')
        } else {
            res.render('labs/edit', {
                lab: lab,
                errorMessage: 'Error updating Lab'

            })
        }    
    }
})

router.delete('/:id', async (req, res) => {
    let lab
    try{
        lab = await Lab.findById(req.params.id)
        await lab.remove()
        res.redirect('/labs')
    } catch {
        if (lab == null) {
            res.redirect('/')
        } else {
            res.redirect(`/labs/${lab.id}`)
        
        }    
    }
})

module.exports = router