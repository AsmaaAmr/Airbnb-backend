const User = require('../models/users');

//contain all business logic
module.exports = {
  all(req, res, next){
    limit =  parseInt(req.query.limit) || ''
    User.find({}).limit(limit)
    .then(users => res.send(users))
    .catch(next)

},

  create(req, res, next){
    // next from middelware
    const userProps = req.body;
    User.create(userProps)
      .then(user => res.send(user)) // 200 to user
      .catch(next) // if error send to next middle ware


  },

  edit(req, res, next){
    const userId = req.params.id;
    const userProps = req.body;
    // get user and update
    User.findByIdAndUpdate({_id: userId}, userProps)
    // if success get user after updated
    .then(() => User.findById({_id: userId}))
    //if you get user send it
    .then(user => res.send(user))
    //else send to middle
    .catch(next);
  },

  delete(req, res, next){
    const userId = req.params.id;
    User.findByIdAndRemove({_id: userId})
    // in case is removed return 204 abject?
      .then(user => res.status(204).send(user))
      .catch(next);
  }
};
