var express = require('express');
var router = express.Router();
const userController = require("../controllers/users_controller");
module.exports = (app) =>{

  app.post('/api/users', userController.create);

}
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
