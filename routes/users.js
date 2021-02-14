var express = require('express');
var router = express.Router();

const User = require("../models/users");

const userController = require("../controllers/users_controller");
module.exports = (app) =>{
  app.get('/api/users', userController.all);
  app.post('/api/users', userController.create);
  app.delete('/api/users/:id', userController.delete)
  app.put('/api/users/:id', userController.edit);
  // signup route
  app.post("/signup",userController.signup);
  // login route
  app.post("/login",userController.login);
  //logout route
  app.get("/logout",userController.logout);
  //ShowProfile route
  app.get("/user/profile",userController.showProfile);
  //All trips for specific user
  app.get("/user/trips",userController.getAllTrips);
  app.get("/user/trip/:id",userController.getTripDetails);
  //Edit profile
  app.put('/user/editProfile/:id', userController.editProfile);
  //Search route
  app.post('/search',userController.search);
  //Reservation route
  app.post('/user/reserveHome/:id',userController.reserve);
}
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
