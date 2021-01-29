const User = require('../models/users');

//contain all business logic
module.exports = {
//   all(req, res, next){
//     limit =  parseInt(req.query.limit) || ''
//     Driver.find({}).limit(limit)
//     .then(drivers => res.send(drivers))
//     .catch(next)

// },

  create(req, res, next){
    // next from middelware
    const userProps = req.body;
    User.create(userProps)
      .then(user => res.send(user)) // 200 to user
      .catch(next) // if error send to next middle ware


  },

//   edit(req, res, next){
//     const driverId = req.params.id;
//     const driverProps = req.body;
//     // get user and update
//     Driver.findByIdAndUpdate({_id: driverId}, driverProps)
//     // if success get user after updated
//     .then(() => Driver.findById({_id: driverId}))
//     //if you get user send it
//     .then(driver => res.send(driver))
//     //else send to middle
//     .catch(next);
//   },

//   delete(req, res, next){
//     const driverId = req.params.id;
//     Driver.findByIdAndRemove({_id: driverId})
//     // in case is removed return 204 abject?
//       .then(driver => res.status(204).send(driver))
//       .catch(next);
//   }
};
