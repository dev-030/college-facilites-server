const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;

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

    client.connect();
    const db = client.db('college-facilities').collection('allUsers');
    const colleges = client.db('college-facilities').collection('colleges');



    app.get('/' , async(req,res) => {
        const result = await db.find({}).toArray();
        res.send(result)
    })

    
    app.get('/colleges' , async(req,res) => {
        const result = await colleges.find({}).toArray();
        res.send(result)
    })


    app.get('/user/:data' ,async(req,res) => {
        const find = await db.findOne({email:req.params.data})

        if(find){
            res.send(find)
        }
    })


   


    app.post('/user' ,async(req,res) => {
        const find = await db.findOne({email:req.body.email})
        if(!find){
            const result = await db.insertOne(req.body);
            res.send(result)
        }else{
            res.send({})
        }
    })

    app.post('/collegereview' ,async(req,res) => {
        const update = {
            $set : {
                review: `${req.body.body.review}`
            }
        }
        const result = await colleges.updateOne({_id: new ObjectId(`${req.body.body.collegeData._id}`)},update)
        res.send(result)
    })

    app.post('/admission' ,async(req,res) => {
        const find = await db.findOne({email:req.body.userEmail})
        if(find){
           
            const update = {
                $addToSet : {
                    admittedCollege : req.body.collegeData
                }
            }
            const result = await db.updateOne({email:req.body.userEmail},update)
            res.send(result)           
        }
    })






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(process.env.PORT || 3000, ()=> console.log('listening....'))