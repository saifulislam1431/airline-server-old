const express = require("express");
const cors = require("cors");
require("dotenv").config()
const port = process.env.PORT || 5000;
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;


app.use(cors());
app.use(express.json())




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const flightsCollection = client.db("skyzen").collection("flights")
    const usersCollection = client.db("skyzen").collection("users")

// Flights API
    app.get("/all-flights",async(req,res)=>{
        const result = await flightsCollection.find({}).toArray();
        res.send(result);
    })

    // User API
    app.post("/users" , async(req,res)=>{
        const newUser = req.body;
        const email = newUser.email;
        const query = {email: email};
        const existingUser = await usersCollection.findOne(query)
        if(existingUser){
            return res.json("User Already Exist")
        }else{
            const result = await usersCollection.insertOne(newUser)
        res.send(result)
        }

    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Database successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/",(req,res)=>{
    res.send("Airline Server Running")
})

app.listen(port,()=>{
    console.log(`This app is running at port ${port}`);
})