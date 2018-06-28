const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection
const Schema = mongoose.Schema
const bodyParser = require('body-parser');

const dbuser = 'maparsons83'
const dbpassword = 'Capstone21!'

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(cors());

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
                        username: String,
                        timestamp: Number,
                        message: String
                    }
                ]
            }
        }
    ]
})

const Projects = mongoose.model('Projects', projectSchema)


app.get('/', (req, res) => {
    res.send("It Works2");
})

app.get('/messages', (req, res) => {
    Projects.find({}, 'projects.channel.messages.user projects.channel.messages.message', function (err, projects) {
        res.send(projects)
        
            
        // console.log(projects[5].projects[0].channel.messages)
        // res.send(projects[5].projects[0].channel.messages)
    })
})

app.get('/projects', (req, res) => {
    Projects.find({}, function (err, projects) {
        res.send(projects[0])
    })
})

app.post('/projects', (req, res) => {
    const project = req.body
    Projects.findOneAndUpdate({username: 'Matty'}, {$push: {projects: project}}, function (err, newProject) {
        console.log(err)
    })
    res.status(201)
    res.send(req.body)
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))