var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.static("public")); //To grab images

app.get("/urls", (req, res) => {

  var templateVars = {
    urls: urlDatabase,
    note: "You are currently not logged in at the moment",
    username: req.cookies.username
  }

  res.render("urls_index", templateVars);
});

app.get("/tinyapp", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {

  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.post("/getlink", (req, res) => {
  if (req.body.longURL === "") {
    res.redirect('/tinyapp')
  } else {
    var arr = randomString();
    urlDatabase[arr] = req.body.longURL;
    res.redirect('/urls');
  }
});


/*app.post("/url", (req, res) => {
  urlDatabase[] = req.body.longURL
}
res.redirect('/urls')
})*/


/*app.post("/url", (req, res) => {
  var arr = randomString();
  urlDatabase[arr] = req.body.longURL;
  //link = 'localhost:8080/u/' + arr;
  res.render("urls_index");
  //res.send("Here is your new link: " + str.link('http://localhost:8080/u/' + arr)); // Respond with 'Ok' (we will replace this)

});*/

app.post("/urls/:id/update", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
    urlDatabase[req.params.id] = req.body.longURL
    console.log("string")
    res.redirect("/urls")
  } else {
    res.redirect("/urls")
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1)
    delete urlDatabase[req.params.id];
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Running WEB SERVER on port ${PORT}!`);
});

function randomString(length, chars) {
  var length = 6;
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

//var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');