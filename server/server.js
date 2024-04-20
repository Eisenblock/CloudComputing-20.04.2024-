require ('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectToMongo() {
  
    await client.connect();
  
}
connectToMongo();
  
const db = client.db('professor_ratings');
const collections = db.collection('professors');

// Routes
app.get('/prof', async (req, res) => {
  
  const professors = await collections.find().toArray();
  console.log("get" + professors);
  res.json(professors);
});

app.post('/prof', async (req, res) => {
  
    console.log(req.body);

    const result = await collections.insert(req.body);
    console.log(result);
    res.status(201).json(result.ops[0]);
  
});

app.delete('/prof/:id', async (req, res) => {
 
    console.log("id : " + req.params.id);
    const result = await collections.deleteOne({ _id: ObjectId("\"" + req.params.id + "\"")});
    console.log("id : " + result.toArray()); 
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
  
});

// Similar routes for PUT and DELETE

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
