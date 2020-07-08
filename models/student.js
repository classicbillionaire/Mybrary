const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
   /* publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    CreatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    */
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lab'
    }
})

/* bookSchema.virtual('coverImagePath').get(function(){
    if (this.coverImage != null && this.coverImageType !== null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})
*/

module.exports = mongoose.model('Student', studentSchema)
