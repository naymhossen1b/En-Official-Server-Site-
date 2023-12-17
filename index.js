require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const uri = process.env.MONGO_URL;
// console.log(uri)

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

    const userCollection = client.db("urbanHaven").collection("users");
    const categoryNameCollection = client.db("urbanHaven").collection("categories");
    const allSubCategoryCollection = client.db("urbanHaven").collection("allSubCategory");
    const allProductsCollection = client.db("urbanHaven").collection("allProducts");

    //// All Products Collection\\\\
    app.get("/products", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.send(result);
    });

    //// All allSubcategories \\\
    app.get("/allSubCategories", async (req, res) => {
      const subCategory = await allSubCategoryCollection.find().toArray();
      res.send(subCategory);
    });
    /// category Section\\\\\\
    app.get("/categories", async (req, res) => {
      const result = await categoryNameCollection.find().toArray();
      res.send(result);
    });

    ////////// User Registration Section\\\\\\\\\
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newData = req.body;
      const result = await userCollection.insertOne(newData);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! 🔥 🔥 🔥 ");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! 🔥");
});

app.listen(port, () => {
  console.log(`En server app listening on port ${port} 🔥`);
});
