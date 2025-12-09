const express = require('express');
const cors = require('cors');
const products = require('./routes/products');
const user = require('./routes/user');
const mongoose = require("mongoose");
const server = express();
mongoose
  .connect("mongodb://localhost:27017/Products")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`error in connection to db : ${err}`);
  });

server.use(cors())  
server.use(express.json());

server.use('/products',products);
server.use('/users',user);

server.listen(3002,()=>{
    console.log('Server is Running');
    
});