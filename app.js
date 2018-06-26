const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path')
const CORS = require('cors')

const app = express();

app.get('/', (req, res) => {
    res.send("It Works");
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))