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
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const advantageCollection = database.collection("advantages");
        console.log("database connected");

        //GET All packages API
        app.get('/packages', async (req, res) => {

            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages)
        })

        //GET All Orders API
        app.get('/orders', async (req, res) => {

            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders)
        })
        //GET ALL Advantages API
        app.get('/advantages',async(req, res)=> {
            const cursor = advantageCollection.find({});
            const advantages = await cursor.toArray();
            res.json(advantages)
        })

        //GET Package Detail by Id API
        app.get('/package/detail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })
        //GET All Reviews API
        app.get('/reviews',async(req, res)=> {

            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews)
        })

        //POST New Package API
        app.post('/addPackage', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.json(result)
        })

        //POST  New Order
        app.post('/proceedOrder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

        //DELETE Order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        //UPDATE Order Status API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'approved'
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
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