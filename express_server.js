var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {

  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {

  var arr = randomString();
  urlDatabase[arr] = req.body.longURL;
  str = '/u/' + arr;
  res.send("Here is your new link: " + str.link('http://localhost:8080/u/' + arr)); // Respond with 'Ok' (we will replace this)

});

app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}!`);
});

function randomString(length, chars) {
  var length = 6;
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

//var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');