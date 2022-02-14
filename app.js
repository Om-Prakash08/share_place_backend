const fs =require('fs') ;
const path =require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const placeRoutes = require("./routes/places-route");
const UsersRoutes = require("./routes/users-route");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
  })
);

app.use('/uploads/images',express.static(path.join('uploads','images'))) ;

app.use((req,res,next) =>{
   res.setHeader('Access-Control-Allow-Origin','*') ;
   res.setHeader('Access-Control-Allow-Headers','Origin ,X-Requested-With ,Content-Type ,Accept ,Authorization' )
   res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH,DELETE')
   next() ;
}) ;

app.use("/api/places", placeRoutes);
app.use("/api/users", UsersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
     fs.unlink(req.file.path,(err)=>{
       console.log(err) ;
     }) ;
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured !" });
});





mongoose
  .connect(
    `mongodb+srv://${process.env.Db_User}:${process.env.Db_Password}@cluster0.qmbal.mongodb.net/${process.env.Db_Name}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => {
    app.listen(process.env.PORT||5000);
    console.log("Connected to database");
  })
  .catch((Error)=>{
      console.log("connecion failed!")
  });
