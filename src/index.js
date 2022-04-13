const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const express = require('express');

const app = express();
const port = 3000;

app.post('/', (req, res) => {
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: 'Hello there!',
            to: `whatsapp:${process.env.MY_PHONE_NUMBER}`
        })
        .then(message => console.log(message.sid));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});