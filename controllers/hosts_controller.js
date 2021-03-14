const User = require("../models/users");
const HostedHome = require("../models/hostedHome");
const Reservation = require("../models/reservations");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
var config = require("../config");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public');
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

//contain all business logic
module.exports = {

  uploadimg(req,res,next){
    console.log(req.files)
    res.json({message:"Images uploaded successfully"})
  },
  
  all(req, res, next) {
    limit = parseInt(req.query.limit) || "";
    User.find({})
      .limit(limit)
      .then((users) => res.send(users))
      .catch(next);
  },

  create(req, res, next) {
    // next from middelware
    const userProps = req.body;
    User.create(userProps)
      .then((user) => res.send(user)) // 200 to user
      .catch(next); // if error send to next middle ware
  },

  edit(req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;
    // get user and update
    User.findByIdAndUpdate({ _id: userId }, userProps)
      // if success get user after updated
      .then(() => User.findById({ _id: userId }))
      //if you get user send it
      .then((user) => res.send(user))
      //else send to middle
      .catch(next);
  },

  delete(req, res, next) {
    const userId = req.params.id;
    User.findByIdAndRemove({ _id: userId })
      // in case is removed return 204 abject?
      .then((user) => res.status(204).send(user))
      .catch(next);
  },
  //hostedHome
  home(req,res){
    return res.status(200).send("This is the home page of host");
  },
  // //signup
  // async signup(req, res) {
  //   const body = req.body;

  //   if (!(body.email && body.password)) {
  //     return res.status(400).send({ error: "Data not formatted properly" });
  //   }
  //   // createing a new mongoose doc from user data
  //   const user = new User(body);
  //   // generate salt to hash password
  //   const salt = await bcrypt.genSalt(10);
  //   // now we set user password to hashed password
  //   user.password = await bcrypt.hash(user.password, salt);
  //   user.save().then((doc) => {
  //     var token = jwt.sign({ id: user._id }, config.secret, {
  //       expiresIn: 86400,
  //     });
  //     res.status(200).send({ auth: true, token: token });
  //   });
  // },
  // //login
  // async login(req, res) {
  //   debugger;
  //   const body = req.body;
  //   const user = await User.findOne({ email: body.email });
  //   if (user) {
  //     // check user password with hashed password stored in the database
  //     const validPassword = await bcrypt.compare(body.password, user.password);
  //     if (validPassword) {
  //       var token = jwt.sign({ id: user._id }, config.secret, {
  //         expiresIn: 86400,
  //       });
  //       res.status(200).json({ auth: true, token: token });
  //       //res.redirect("/host/");
  //     } else {
  //       res.status(400).json({ auth: false, token: null });
  //     }
  //   } else {
  //     res.status(401).json({ error: "User does not exist" });
  //   }
  // },
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
      User.findById(decoded.id, function (err, user) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
      });
    });
  },
  //EditProfile
  editProfile(req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;
    User.findByIdAndUpdate({ _id: userId }, userProps)
      .then(() => User.findById({ _id: userId }))
      .then((user) => res.send(user))
      .catch(next);
  },
  //Search for Home
  search(req, res) {
    const body = req.body;
    console.log(req.body);
    HostedHome.aggregate(
      [
        {
          $match: {
            location: req.body.location,
            no_Of_Guests: { $gte: req.body.no_Of_Guests },
          },
        },
        {
          $lookup: {
            from: "reservations",
            let: { hostedHomeID: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$hostedHomeID","$$hostedHomeID"] },
                      {
                        $not: [
                          {
                            $and: [
                              {
                                $eq: ["$checkIn", new Date(req.body.fromDate)],
                              },
                              {
                                $eq: ["$checkOut", new Date(req.body.toDate)],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        $not: [
                          {
                            $and: [
                              {
                                $lte: ["$checkIn", new Date(req.body.fromDate)],
                              },
                              {
                                $lte: ["$checkOut", new Date(req.body.toDate)],
                              },
                              {
                                $gte: [
                                  "$checkOut",
                                  new Date(req.body.fromDate),
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        $not: [
                          {
                            $and: [
                              {
                                $gte: ["$checkIn", new Date(req.body.fromDate)],
                              },
                              {
                                $gte: ["$checkOut", new Date(req.body.toDate)],
                              },
                              {
                                $lte: ["$checkIn", new Date(req.body.toDate)],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        $not: [
                          {
                            $and: [
                              {
                                $lte: ["$checkIn", new Date(req.body.fromDate)],
                              },
                              {
                                $gte: ["$checkOut", new Date(req.body.toDate)],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        $not: [
                          {
                            $and: [
                              {
                                $gte: ["$checkIn", new Date(req.body.fromDate)],
                              },
                              {
                                $lte: ["$checkOut", new Date(req.body.toDate)],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "reservedhomes",
          },
        },
      ],
      (err, docs) => {
        if (err) res.send(err.message);
        res.send(docs);
      }
    );
  },
  //Host A Home
  hostHome(req,res){
    var token = req.headers["x-access-token"];
    if (!token)
      return res.status(401).send({ auth: false, message: "No token provided." });
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      User.findById(decoded.id, function (err, user) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        if(user.type ==true){
          const hostHome = new HostedHome(req.body);
          console.log(req.body)
          console.log(req.files)
          hostHome.HostID =decoded.id;
          hostHome.images = req.files;
          hostHome.save();
          return res.status(200).send(hostHome);
        }
        else{
          return res.status(404).send("You cannot Hosted a Home by this user");
        }
      });
    });
  },
  //Edit Hosted Home
  editHostedHome(req,res,next){
    const HomeID = req.params.id;
    const HostedHomeProps = req.body;
    HostedHome.findByIdAndUpdate({ _id: HomeID }, HostedHomeProps)
      .then(() => HostedHome.findById({ _id: HomeID }))
      .then((home) => res.send(home))
      .catch(next);
  },
  //Delete Hosted Home
  deleteHostedHome(req,res,next){
    const HomeID = req.params.id;
    HostedHome.findByIdAndRemove({ _id: HomeID })
      .then((home) => res.status(204).send(home))
      .catch(next);
  },
  //logout
  logout(req, res) {
    res.status(200).send({ auth: false, token: null });
  },
  getAllHosted(req,res){
    var token = req.headers["x-access-token"];
    if (!token)
      return res.status(401).send({ auth: false, message: "No token provided." });
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: "Failed to authenticate token." });
      HostedHome.find({HostID:decoded.id}, function (err, homes) {
        if (err)
          return res.status(500).send("There was a problem finding homes.");
        if (!homes) return res.status(404).send("No homes found.");

        res.status(200).send(homes);
      });
    });
  }
};
