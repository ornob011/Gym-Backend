require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_PATH
let client = new MongoClient(uri, { useNewUrlParser: true })

app.use(cors())
app.use(bodyParser.json())

global.needed;

const nodemailer = require('nodemailer');

let constants = require("./constant");

var transporter = nodemailer.createTransport({
    host: 'smtp.aol.com',
    port: '587',
    auth: {
        service: 'aol',
        user: 'ornob011',
        pass: constants.pass
    }
});

app.get('/')

app.post('/send', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true })
    const info = req.body;
    const mm = JSON.stringify(info);
    let mail = JSON.parse(mm);

    needed = mail.Email;
    console.log(needed);

    var mailOptions = {
        from: 'ornob011@aol.com',
        to: needed,
        subject: 'Membership Created',
        text: `Hi, Welcome to Power-X-Gym. Your credential:
        First Name: ${mail.First_Name}
        Last Name: ${mail.Last_Name}
        Email: ${mail.email}
        Mobile Number: ${mail.Phone}
        Date of Birth: ${mail.Birth_Date}
        Gender: ${mail.Gender}
        Address: ${mail.Address}
        Country: ${mail.Country}
        City: ${mail.City}
        Postcode: ${mail.PostCode}

        Your membership has been created.`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email Sent:' + info.response);
        }
    })

    client.connect(err => {
        const collection = client.db("gym").collection("info")
        collection.insert(info, (err, result) => {
            if (err) {
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops)
            }
        })
        client.close()

    })

})


app.get('/info', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("gym").collection("info")
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents)
            }
        })
        client.close()
    })
})

app.get("/", (req, res) => {
    res.send("<h1>Power X System</h1>");
});


const port = process.env.PORT || 4200
app.listen(port, () => console.log(`Listening from port ${port}`))