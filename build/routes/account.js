"use strict";
var User_1 = require("../models/User");
var crypto = require("crypto");
var Config_1 = require("../Config");
function verifySession(req, res, next) {
    let userId = req.session["userId"];
    if (userId) {
        next();
    }
    else {
        res.redirect("/login");
    }
}
exports.verifySession = verifySession;
function loginIndex(req, res) {
    res.render('login');
}
exports.loginIndex = loginIndex;
function login(req, res) {
    let name = req.body.name;
    let password = req.body.password;
    const hash = crypto.createHmac('sha256', Config_1.default.sessionSecret)
        .update(password)
        .digest("base64");
    console.log(hash);
    User_1.default.findOne({
        name: name,
        password: hash
    }, (error, user) => {
        if (error) {
            res.send(400);
        }
        else {
            if (user != null) {
                req.session["userId"] = user._id;
                res.redirect("/");
            }
            else {
                res.render("login", { errorMessage: "Invalid username/password" });
            }
        }
    });
}
exports.login = login;
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error occured during session destroy.");
            res.redirect("/");
        }
        else {
            res.redirect("/login");
        }
    });
}
exports.logout = logout;
