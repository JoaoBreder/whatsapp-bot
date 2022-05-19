const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./src/bot');


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

// Module Export
module.exports = { restaurantOrderBot: functions.https.onRequest(app) };