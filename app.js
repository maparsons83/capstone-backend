const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const path = require('path')
const CORS = require('cors')
const mlabURI = 'mongodb://ds121321.mlab.com:21321/kenzie-capstone'
const db = mongoose.connection
const Schema = mongoose.Schema

const dbuser = 'maparsons83'
const dbpassword = 'Capstone21!'
const dbname = 'kenzie-capstone'
const dburi = 'ds121321.mlab.com:21321/'

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

Projects.create({ username: 'Matt' }, function (err, Matt) {
    if (err) return err;
    console.log('CREATED')
})

const app = express();

app.get('/', (req, res) => {
    res.send("It Works");
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))