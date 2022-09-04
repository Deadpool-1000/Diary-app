// npm packages
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("./db/mongoose.js");
const User = require("./models/User.js");
const path = require("path");
var oneLinerJoke = require("one-liner-joke");
const Quote = require("inspirational-quotes");
require('dotenv').config();
// Express
const app = express();
// EJS
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

// Express Session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/useDB",
    }),
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home route
app.get("/", function (req, res) {
  res.render("home");
});

// login route
app.get("/login", function (req, res) {
  res.render("login");
});

// Register route

app.get("/register", function (req, res) {
  res.render("register");
});

// Diary
app.get("/diary", isLoggedIn, async function (req, res) {
  res.render("diary", {
    name: req.user.username,
    Posts: req.user.posts,
  });
});

app.get("/compose", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("compose");
  } else {
    res.redirect("login");
  }
});

app.post("/compose", async function (req, res) {
  const post = {
    title: req.body.title,
    content: req.body.content,
  };
  req.user.posts.push(post);
  try {
    await req.user.save();
  } catch (e) {
    res.send({ e });
  }
  res.redirect("/diary");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/diary");
      });
    }
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/diary",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/joke", function (req, res) {
  const randomJoke = oneLinerJoke.getRandomJoke();
  res.send(randomJoke);
});

app.get("/quote", function (req, res) {
  const newQuote = Quote.getQuote();
  res.send(newQuote);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/profile", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("profile", { User: req.user });
  } else {
    res.redirect("/login");
  }
});

// Server setup
app.listen(3000, function () {
  console.log("hello");
});
