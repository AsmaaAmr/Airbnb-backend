var express = require('express');
var router = express.Router();
const Admin = require("../models/admin");
const adminController = require("../controllers/admins_controller");
module.exports = (app) =>{
  //users
  app.get('/admin/users', adminController.allUsers);
  app.post('/admin/users', adminController.createUser);
  app.delete('/admin/users/:id', adminController.deleteUser)
  app.put('/admin/users/:id', adminController.editUser);
  //trips
  app.get('/admin/reservations', adminController.allReservations);
  app.post('/admin/reservations', adminController.createReservation);
  app.delete('/admin/reservations/:id', adminController.deleteReservation)
  app.put('/admin/reservations/:id', adminController.editReservation);
  //host a Home
  app.get('/admin/homes', adminController.allHomes);
  app.post('/admin/homes', adminController.createHome);
  app.delete('/admin/homes/:id', adminController.deleteHome)
  app.put('/admin/homes/:id', adminController.editHome);
 // login route
  app.post("/admin/login",adminController.login);
   //logout route
  app.get("/logout",adminController.logout);
  //ShowProfile route
  app.get("/admin/profile",adminController.showProfile);
  //Edit profile
  app.put('/admin/editProfile/:id', adminController.editProfile);

}