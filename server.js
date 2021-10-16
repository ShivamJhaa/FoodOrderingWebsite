const express = require('express')
const http = require('http')
const bcrypt = require('bcrypt')
const path = require('path')
const bodyParser = require('body-parser')
const users = require('./data').userDB

const app = express()
const server = http.createServer(app);

app.use(express.static(path.join(__dirname,'./public')))


app.listen(5000,()=>{
    console.log('Server is listening at port 5000')
})