const express = require("express");
const path = require('path')
require('./db/Mongoose.js')


const app = express()
const port = process.env.port || 3000
const UserRouter = require('./routers/user.js')
const TaskRouter = require('./routers/task.js')
const maintain = false
const pathpublc = path.join(__dirname, '../public')
console.log(pathpublc)

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
app.use(express.static(pathpublc))












app.listen(port, () => {
    console.log('server up')
})