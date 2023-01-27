//modules:
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors')
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
//controllers:
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile')


////// injecting Environment Variables
const PORT = process.env.PORT || 3000;
const KEY = process.env.KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;

//initialise
const app = express();
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'dpg-cf8noco2i3mmd0llo4l0-a',
      port : 5432,
      user : 'nisal',
      password : DB_PASSWORD,
      database : 'facedetectdb'
    }
  });
  
////middleware////

app.use(express.json())
app.use(cors())

//////////////////

app.get('/', (req, res) => {
    res.send('it is working!')
})


app.post('/signin', (req, res) => signin.hangleSignIn(req, res, knex, bcrypt))

app.post('/register', (req, res) => register.handleRegister( req, res, knex, bcrypt)) //dependency inject the node modules as params

app.get('/profile/:id',(req,res) => profile.handleProfile(req, res, knex))

app.put('/image', (req,res) => image.hangleImage(req, res, knex, ClarifaiStub, grpc, KEY))


app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
    //in terminal: PORT=3000 node server.js
    //OR PORT=3000 npm start
})



/*
/--> res == this is working 
/signin --> POST = success/fail //why post? whenever you send pw you dont wanna send in query string, you want to send password in the body via https
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
 */