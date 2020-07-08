const mongoose = require('mongoose')
const Student = require('./student')

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    Date: {
        type: Date,
    }
})

labSchema.pre('remove', function(next) {
    Student.find({ lab: this.id },  (err, students) => {
        if (err) {
            next(err)
        } else if (students.length > 0) {
            next(new Error('该实验有学生'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Lab', labSchema)