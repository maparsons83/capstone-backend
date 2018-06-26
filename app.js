const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const path = require('path')
const CORS = require('cors')
mongoose.connect('mongodb://localhost/test')
const db = mongoose.connection
const Schema = mongoose.Schema

const projectSchema = new Schema ({
    
})

const app = express();

app.get('/', (req, res) => {
    res.send("It Works");
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))