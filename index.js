require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://urben-haven.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.APP_ID}:${process.env.APP_KEY}@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
    // await client.connect();

    const userCollection = client.db("urbanHaven").collection("users");
    const categoryNameCollection = client
      .db("urbanHaven")
      .collection("categories");
    const allSubCategoryCollection = client
      .db("urbanHaven")
      .collection("allSubCategory");
    const allProductsCollection = client
      .db("urbanHaven")
      .collection("allProducts");
    const userCartsCollection = client
      .db("urbanHaven")
      .collection("userSopCarts");
    const ratingsCollection = client.db("urbanHaven").collection("ratings");

    /// Product Ratings
    app.get("/ratings", async (req, res) => {
      const result = await ratingsCollection.find().toArray();
      res.send(result);
    });
    app.post("/ratings", async (req, res) => {
      const rate = req.body;
      const result = await ratingsCollection.insertOne(rate);
      res.send(result);
    });

    ///// product  increment and decrement\\\
    app.put("/userCarts/increment/:id", async (req, res) => {
      const { id } = req.params;
      await userCartsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { product_quantity: 1 } }
      );
      const updatedCartItem = await userCartsCollection.findOne({
        _id: new ObjectId(id),
      });
      // console.log("updatedCartItem==============>", updatedCartItem, id);
      res.send(updatedCartItem);
    });

    app.put("/userCarts/decrement/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await userCartsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { product_quantity: -1 } }
        );
        const updatedCartItem = await userCartsCollection.findOne({
          _id: new ObjectId(id),
        });
        // console.log("updatedCartItem==============>", updatedCartItem, id);
        res.json(updatedCartItem);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    //// user product carts
    app.delete("/deleteCarts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCartsCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/userCarts/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await userCartsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/userCarts", async (req, res) => {
      const cart = req.body;
      const result = await userCartsCollection.insertOne(cart);
      res.send(result);
    });

    //// All Products Collection\\\\
    app.get("/products", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await allProductsCollection.insertOne(product);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allProductsCollection.deleteOne(query);
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
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB! 🔥 🔥 🔥 "
    );
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
