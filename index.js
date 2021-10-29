const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yqsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("tourEasedb");
        const packagesCollection = database.collection("packages");
        console.log("database connected");

        //GET API
        app.get('/packages', async (req, res) => {

            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages)
        })

        //POST API
        app.post('/addPackage', async (req, res) => {
            console.log("product to be added", req.body)
            res.json("added")
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("from tourEase server");
})

app.listen(port, () => {
    console.log("listening from port:", port);
})