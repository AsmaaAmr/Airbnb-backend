var express = require('express');
var router = express.Router();
const User = require("../models/users");
const hostController = require('../controllers/hosts_controller');
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public');
  },
  filename: (req, file, cb) => {
      cb(null,file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = (app) =>{
  // signup route
  //app.post("/signup",hostController.signup);
  // login route
  //app.post("/host/login",hostController.login);
  //logout route
  app.get("/logout",hostController.logout);
  app.get("/host/",hostController.home)
  //ShowProfile route
  app.get("/host/profile",hostController.showProfile);
  //Edit profile
  app.put('/host/editProfile/:id', hostController.editProfile);
  //Search route
  //app.post('/search',hostController.search);
  app.post('/host/hostHome',upload.array('images',10),hostController.hostHome);
  app.get('/host/hostedhomes',hostController.getAllHosted);
  app.put('/host/editHostedHome/:id',hostController.editHostedHome);
  app.delete('/host/deleteHostedHome/:id',hostController.deleteHostedHome);
  //app.post('/upload',upload.array('images',10),hostController.uploadimg)
}