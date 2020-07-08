if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const labRouter = require('./routes/labs')
const studentRouter = require('./routes/students')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.set('public', __dirname + '/public')
app.use(express.static(__dirname + '/public'));

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose') 
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.log.error(error))
db.once('open', () => console.log('connected to Mongoose'))


app.use('/', indexRouter)
app.use('/labs', labRouter)
app.use('/students', studentRouter)

app.listen(process.env.PORT || 3000)