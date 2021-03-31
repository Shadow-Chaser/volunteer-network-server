const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT || 8000


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8cui.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
   console.log("connected"); 

   app.post('/addEvent', (req, res)=>{
     const newEvent = req.body;
     console.log(newEvent);

     eventCollection.insertOne(newEvent)
     .then(result => {
         console.log('inserted count', result.insertedCount);
         res.send(result.insertedCount > 0)
     })
   })

   app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
  })

  app.delete('deleteEvent/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    eventCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})