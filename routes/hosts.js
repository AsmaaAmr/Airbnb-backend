var express = require('express');
var router = express.Router();
const User = require("../models/users");
const hostController = require('../controllers/hosts_controller');
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
  app.post('/search',hostController.search);
  app.post('/host/hostHome',hostController.hostHome);
  app.put('/host/editHostedHome/:id',hostController.editHostedHome);
  app.delete('/host/deleteHostedHome/:id',hostController.deleteHostedHome);

}