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

const taskSchema = new Schema({
    taskName: String,
    completed: Boolean
})

const messageSchema = new Schema({
    username: String,
    timestamp: Number,
    message: String
})

const projectSchema = new Schema({

    projectName: String,
    summary: String,
    targetAudience: String,
    dates: String,
    estimateLink: String,
    location: String,
    leads: String,
    tasks: [taskSchema],
    channel: {
        messages: [messageSchema]
    }
})

const userSchema = new Schema({
    username: String,
    email: String,
    projects: [projectSchema]
})

const Tasks = mongoose.model('Tasks', taskSchema)
const Messages = mongoose.model('Messages', messageSchema)
const Projects = mongoose.model('Projects', projectSchema)
const Users = mongoose.model('Users', userSchema)

app.get('/', (req, res) => {
    res.send("It Works");
})

app.get('/user/:id', (req, res) => {
    Users.findOne({ "_id": req.params.id }, (error, user) => {
        console.log(user.projects)
        res.send(user)
    })
})

app.get('/user/:id/project/:projectID/messages', (req, res) => {
    Users.findById(req.params.id, (error, user) => {
        const project = user.projects.id(req.params.projectID)
        console.log(project)
        res.send(project.channel.messages)
    })
})

app.get('/project/:projectName/messages', (req, res) => {
    Users.findOne({ "projects.projectName": req.params.projectName }, "projects", (error, userWithProjects) => {
        const project = userWithProjects.projects.find(project => project.projectName === req.params.projectName)
        res.send(project.channel.messages)
    })
})

app.get('/projects', (req, res) => {
    Users.find({}, function (err, projects) {
        res.send(projects)
    })
})

app.post('/projects', (req, res) => {
    const project = req.body
    Users.findOneAndUpdate({}, {
        $push: {
            projects: project
        }
    }, function (err, newProject) {
        console.log(err)
    })
    res.status(201)
    res.send(req.body)
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))