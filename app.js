const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const path = require('path')
const CORS = require('cors')
const db = mongoose.connection
const Schema = mongoose.Schema

const dbuser = 'maparsons83'
const dbpassword = 'Capstone21!'

mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds121321.mlab.com:21321/kenzie-capstone`)

const projectSchema = new Schema ({
    username: String,
    email: String,
    projects: [
        {
            projectName: String,
            summary: String,
            targetAudience: String,
            dates: Date,
            estimateLink: String,
            location: String,
            leads: String,
            tasks: [
                {
                    taskName: String,
                    completed: Boolean
                }
            ],
            channel: {
                messages: [
                    {
                        user: String,
                        timestamp: Number,
                        message: String
                    }
                ]
            }
        }
    ]
})

const Projects = mongoose.model('Projects', projectSchema)

const app = express();

app.get('/', (req, res) => {
    res.send("It Works");
})

app.get('/messages', (req, res) => {
    fetch(`mongodb://${dbuser}:${dbpassword}@ds121321.mlab.com:21321/kenzie-capstone`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))