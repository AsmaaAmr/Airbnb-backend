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
  app.get("/profile",userController.showProfile);
  //Edit profile
  app.put('/editProfile/:id', userController.editProfile);

}
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
