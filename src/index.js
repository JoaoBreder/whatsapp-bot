const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot');
require('dotenv').config();


// Server Port
const PORT = 3000;

// App inicialization and config
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Main route
app.post('/', async (req, res) => {
    await bot.processMessage(
        req.body.Body,
        req.body.From,
        req.body.ProfileName
    );

    res.status(200).send('Ok');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});