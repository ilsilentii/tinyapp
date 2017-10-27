var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var express = require('express')
var app = express()

app.use(cookieSession({
    name: 'session',
    keys: ['id'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


const bcrypt = require('bcrypt');
app.use(cookieParser())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs")

var urlDatabase = {
    "userRandomID": {
        "b2xVn2": "http://www.lighthouselabs.ca",
        "9sm5xK": "http://www.google.com"
    }
};



const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
}

var currentuser = null

app.use(express.static("public")); //To grab images

app.get("/urls", (req, res) => {


    var templateVars = {
        urls: urlDatabase[req.session.id],
        account: [req.session.id],
        note: "You are currently not logged in at the moment",
        username: users[req.session.id].id + ". The email associated with this account is: " + users[req.session.id].email
    }
    res.render("urls_index", templateVars);

});

app.get("/", (req, res) => {
    templateVars = {
        urls: "",
        account: "",
        username: null
    }
    res.render("urls_new", templateVars)
});

app.post("/", (req, res) => {
    templateVars = {
        urls: urlDatabase[req.session.id],
        account: [req.session.id],
        username: [req.session.id]
    }
    res.render("urls_new", templateVars)
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

app.get("/loginpage", (req, res) => {
    res.render('enterlogin', {
        error: ""
    });
});

app.post("/login", (req, res) => {

    for (var i of Object.keys(users))
        if (req.body.email === users[i].email && bcrypt.compareSync(req.body.password, users[i].password)) {
            currentuser = users[i].email
            req.session.id = i
            return res.redirect("/urls")
        }

    res.render('enterlogin', {
        error: "Incorrect Email or Password"
    });
});

app.post("/logout", (req, res) => {
    currentuser = null;
    req.session.id = undefined;
    res.redirect('/tinyapp');
});

app.post("/getlink", (req, res) => {

    if (currentuser) {
        if (req.body.longURL === "") {
            res.redirect('/tinyapp')
        } else {

            var arr = randomString();
            if (urlDatabase[req.session.id] === undefined) {
                urlDatabase[req.session.id] = {};
            }
            urlDatabase[req.session.id][arr] = req.body.longURL;
            res.redirect('/urls');


        }
    } else {
        res.render('urls_new')
    }
});

app.get("/registerpage", (req, res) => {

    res.render('register', {
        noemail: ""
    })
});

app.post("/registered", (req, res) => {
    for (var i of Object.keys(users))
        if (req.body.email === users[i].email) {
            return res.render("register", {
                noemail: "This Email Already Exists"
            })
        }

    if (req.body.email === "") {
        return res.render("register", {
            noemail: "Please Enter a Valid Email"
        })
    } else if (req.body.password === "") {
        return res.render("register", {
            noemail: "Please Enter a Valid Password"
        })
    } else {
        var arr = randomString();
        users[arr] = {
            id: arr,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }
        currentuser = users[i].email
        req.session.id = arr;
        res.redirect('/urls')
    }
});


app.post("/urls/:id/update", (req, res) => {
    console.log(urlDatabase)
    console.log(req.session.id)
    console.log(req.params.id)
    if (Object.keys(urlDatabase[req.session.id]).indexOf(req.params.id) > -1) {
        urlDatabase[req.session.id][req.params.id] = req.body.longURL
        console.log("string")
        res.redirect("/urls")
    } else {
        res.redirect("/urls")
    }
});

app.post("/urls/:id/delete", (req, res) => {
    if (Object.keys(urlDatabase[req.session.id]).indexOf(req.params.id) > -1)
        delete urlDatabase[req.session.id][req.params.id];
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