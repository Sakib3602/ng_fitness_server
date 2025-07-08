const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

// console.log(process.env)

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.PRIVATE_NAME}:${process.env.PRIVATE_KEY}@cluster0.b5jufhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const allmember = client.db("ng_fitness").collection("allmembar");




    app.get("/allmembar", async (req, res) => {
      const result = await allmember.find().toArray();
      res.send(result);
    });
    app.patch("/allmembar/:id", async (req, res) => {
      const id = req.params.id;
      const payDate = req.body.date;
      console.log(payDate)
      const result = await allmember.updateOne(
      { _id: new ObjectId(id) },
      { $push: { payments: payDate } }
    );
    res.send(result)
    });
    app.get("/allmembar/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allmember.findOne(query);
      res.send(result);
    });

    app.post("/allmembar", async (req, res) => {
      const doc = req.body;
      const result = await allmember.insertOne(doc);
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
