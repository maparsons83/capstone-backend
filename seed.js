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

const startingUser = {
    "username": "Matty",
    "email": "String",
    "projects": [{
        "projectName": "String",
        "summary": "String",
        "targetAudience": "String",
        "dates": "String",
        "estimateLink": "String",
        "location": "String",
        "leads": "String",
        "tasks": [{
            "taskName": "String",
            "completed": false
        }],
        "channel": {
            "messages": [{
                "username": "String",
                "timestamp": 1,
                "message": "String"
            }]
        }
    }]
}

Users.create(startingUser, function (err, user) {
    if (err) throw err;
    // saved!
    console.log("Saved user:", user)
})