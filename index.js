const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

/// Middle Ware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://enOfficialServer:aT8HZNweMW3ohb6L@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("enOfficial").collection("users");


    //// User Collections 
    app.post('/users', async (req, res) => {})

    app.get('/users', async (req, res) => {})
    
    app.get('/users/:id', async (req, res) => {})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! ✅ 🔥");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! ✅");
});

app.listen(port, () => {
  console.log(`EnOfficial app Running on port ${port} 🔥`);
});
