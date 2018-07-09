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
    password: String,
    projects: [projectSchema]
})

const Task = mongoose.model('Tasks', taskSchema)
const Message = mongoose.model('Messages', messageSchema)
const Project = mongoose.model('Projects', projectSchema)
const User = mongoose.model('Users', userSchema)

app.get('/', (req, res) => {
    res.send("It Works");
})

//Adding a new user
app.post('/signup', (req, res) => {
    const newUser = new User(req.body)
    newUser.save(function (err) {
        if(err) throw err
    })
    res.send({"success": true})
})

//Query for verifying login info
app.post('/login', (req, res) => {
    User.findOne({"email": req.body.email}, (error, userLogin) => {
        if(!userLogin) {
            res.send({"success": false})
        } else { 
        if(req.body.password === userLogin.password) {
            res.send({"username": userLogin.username, "success": true})
        } else {
            res.send({"success": false})
        }
    }}) 
})

//Query for finding all messages associated with a project
app.get('/project/:projectName/messages', (req, res) => {
    User.findOne({ "projects.projectName": req.params.projectName }, { 'password': 0 }, "projects", (error, userWithProjects) => {
        const project = userWithProjects.projects.find(project => project.projectName === req.params.projectName)
        res.send(project.channel.messages)
    })
})


//Query for adding a message to a project
app.post('/project/:projectName/messages', (req, res) => {
    const message = new Message(req.body)
    User.findOne({"projects.projectName": req.params.projectName}, (error, userWithProjects) => {
        const project = userWithProjects.projects.find(project => project.projectName === req.params.projectName)
        project.channel.messages.push(message)
        userWithProjects.save()
    })
    res.status(201)
    console.log('Message created')
    res.send(message)
})

//Query for finding all tasks associated with a project
app.get('/project/:projectName/tasks', (req, res) => {
    User.findOne({"projects.projectName": req.params.projectName}, { 'password': 0 }, "projects", (error, userWithProjects) => {
        const project = userWithProjects.projects.find(project => project.projectName === req.params.projectName)
        res.send(project.tasks)
    })
})

//Query for adding a task to project
app.post('/project/:projectName/tasks', (req, res) => {
    const task = new Task(req.body)
    User.findOne({"projects.projectName": req.params.projectName}, (error, userWithProjects) => {
        const project = userWithProjects.projects.find(project => project.projectName === req.params.projectName)
        project.tasks.push(task)
        userWithProjects.save()
    })
    res.status(201)
    console.log('Task created')
    res.send(task)
})

//Query for pulling a list of all projects
app.get('/projects/:userId', (req, res) => {
    User.find({"username": req.params.userId }, { 'password': 0 }, function (err, user) {
        console.log(user)
    })
    .then(originalUser => {
        User.find({"projects.targetAudience": req.params.userId}, (err, usersWithProjects) => {
            let combinedProjects = [];
            usersWithProjects.forEach(user => {
                let userSharedProjects = user.projects.filter(project => project.targetAudience.includes(req.params.userId));
                console.log(userSharedProjects)
                originalUser[0].projects.push(...userSharedProjects);
            })
            res.send(originalUser[0])
        })
    })
})

//Query for adding a project to a user
app.post('/projects/:userId', (req, res) => {
    const project = req.body
    User.findOneAndUpdate({"username": req.params.userId}, {
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