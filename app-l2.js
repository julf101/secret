// express
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const encrypt = require ("mongoose-encryption")
// const _ = require("lodash");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// mongoose - if local use /<DB name> mongodb+srv://admin-julien:12345677@cluster0.sjco6.mongodb.net/blogDB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => res.render("home"));

app.get("/login", (req, res) => res.render("login"));

app.get("/register", (req, res) => res.render("register"));

app.post("/register", (req, res) => {
  const user = new User ({
    email: req.body.username,
    password: req.body.password
  });
  console.log(user);
  user.save(function(err, doc){
    if(!err) {
      console.log(doc);
      res.render("secrets");
    } else {
      console.log(err);
      res.send(err);
    };
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log("foundUser.password: ", foundUser.password, "Password: ",  password );d
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Wrong password");
        }
      } else {
        res.send("No user with usersname ${username} found");
      };
    };
  });
});



// listen
let PORT = process.env.PORT;
if (PORT == null || port == "") {
  PORT = 3000;
};

app.listen(PORT, () => {
  console.log('Server started on port ', PORT );
});
