const Admin = require("../models/admin");
const User = require("../models/users");
const HostedHome = require("../models/hostedHome");
const Reservation = require("../models/reservations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var config = require("../config");
//contain all business logic
module.exports = {
  //Users Functionality
  //Show all Users
  allUsers(req, res, next) {
    limit = parseInt(req.query.limit) || "";
    User.find({})
      .limit(limit)
      .then((users) => res.send(users))
      .catch(next);
  },
  //Create a user
  async createUser(req, res, next) {
    const user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user
      .save()
      .then((user) => res.send(user))
      .catch(next);
  },
  //Edit a User
  async editUser(req, res, next) {
    debugger;
    const userId = req.params.id;
    const userProps = req.body;
    console.log(req.body);
    if (req.body.password) {
      console.log(userProps.password);
      const salt = await bcrypt.genSalt(10);
      userProps.password = await bcrypt.hash(userProps.password, salt);
      User.findByIdAndUpdate({ _id: userId }, userProps)
        .then(() => User.findById({ _id: userId }))
        .then((user) => res.send(user))
        .catch(next);
    } else {
      User.findByIdAndUpdate({ _id: userId }, userProps)
        .then(() => User.findById({ _id: userId }))
        .then((user) => res.send(user))
        .catch(next);
    }
  },
  //Delete a User
  deleteUser(req, res, next) {
    const userId = req.params.id;
    User.findByIdAndRemove({ _id: userId })
      .then((user) => res.status(204).send(user))
      .catch(next);
  },
  //Reservations Functionality
  //Show all reservations
  allReservations(req, res, next) {
    limit = parseInt(req.query.limit) || "";
    Reservation.find({})
      .limit(limit)
      .then((reservations) => res.send(reservations))
      .catch(next);
  },
  //Create a reservation
  createReservation(req, res, next) {
    const reservationProps = req.body;
    const reservation = new Reservation(reservationProps);
    var token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    jwt.verify(token, config.secret, function (err, decoded) {
      reservation.hostID = decoded.id;
      reservation
        .save()
        .then((reservation) => res.send(reservation))
        .catch(next);
    });
  },
  //Edit a reservation
  editReservation(req, res, next) {
    const reservationId = req.params.id;
    const reservationProps = req.body;
    Reservation.findByIdAndUpdate({ _id: reservationId }, reservationProps)
      .then(() => Reservation.findById({ _id: reservationId }))
      .then((reservation) => res.send(reservation))
      .catch(next);
  },
  //Delete a reservation
  deleteReservation(req, res, next) {
    const reservationId = req.params.id;
    Reservation.findByIdAndRemove({ _id: reservationId }).then((reservation) => res.status(204).send(reservation)).catch(next);
  },
  //Home Functionality
  //Show all Homes
  allHomes(req, res, next) {
    limit = parseInt(req.query.limit) || "";
    HostedHome.find({})
      .limit(limit)
      .then((homes) => res.send(homes))
      .catch(next);
  },
  //Create a Home
  createHome(req, res, next) {
    const homeProps = req.body;
    const home = new HostedHome(homeProps);
    var token = req.headers["x-access-token"];
    if (!token)
      return res.status(401).send({ auth: false, message: "No token provided." });
    jwt.verify(token, config.secret, function (err, decoded) {
      home.HostID = decoded.id;
      home.save().then((home) => res.send(home)).catch(next);
    });
  },
  //Edit a Home
  editHome(req, res, next) {
    const homeId = req.params.id;
    const homeProps = req.body;
    HostedHome.findByIdAndUpdate({ _id: homeId }, homeProps)
      .then(() => HostedHome.findById({ _id: homeId }))
      .then((home) => res.send(home))
      .catch(next);
  },
  //Delete a Home
  deleteHome(req, res, next) {
    const HomeId = req.params.id;
    HostedHome.findByIdAndRemove({ _id: HomeId }).then((home) => res.status(204).send(home)).catch(next);
  },
  //login
  async login(req, res) {
    const body = req.body;
    const admin = await Admin.findOne({ email: body.email });
    if (admin) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, admin.password);
      if (validPassword) {
        var token = jwt.sign({ id: admin._id }, config.secret, {
          expiresIn: 86400,
        });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ auth: true,admininfo:admin,token: token });
      } else {
        res.status(400).json({ auth: false, token: null });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  },
  //ShowProfile
  showProfile(req, res) {
    var token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: "Failed to authenticate token." });
      Admin.findById(decoded.id, function (err, admin) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!admin) return res.status(404).send("No user found.");

        res.status(200).send(admin);
      });
    });
  },
  //EditProfile
  editProfile(req, res, next) {
    const adminId = req.params.id;
    const adminProps = req.body;
    Admin.findByIdAndUpdate({ _id: adminId }, adminProps)
      .then(() => Admin.findById({ _id: adminId }))
      .then((admin) => res.send(admin))
      .catch(next);
  },
  //logout
  logout(req, res) {
    res.status(200).send({ auth: false, token: null });
  },
};
