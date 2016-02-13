"use strict";

import * as express from "express";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

import config from "../Config";
import User from "../models/User";

function signupIndex(req:express.Request, res:express.Response) {
    res.render('signup');
}

function signup(req:express.Request, res:express.Response) {

    let email = req.body["email"];
    let password = req.body["password"];

    const hash = crypto.createHmac('sha256', config.sessionSecret)
        .update(password)
        .digest("base64");

    let user = new User({
        // _id: new mongoose.ObjectID(),
        email: email,
        password: hash
    });

    user.save((error, inserted)=> {
        if (error) {
            res.sendStatus(500);
            return;
        }

        // req.session["userId"] = inserted.get("_id");
        res.redirect("/");
    });
}

function verifySession(req:express.Request, res:express.Response, next:express.NextFunction) {
    let userId = req.session["userId"];

    if (userId) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

function loginIndex(req:express.Request, res:express.Response) {
    res.render('login');
}

function login(req:express.Request, res:express.Response) {
    let email = req.body.email;
    let password = req.body.password;

    const hash = crypto.createHmac('sha256', config.sessionSecret)
        .update(password)
        .digest("base64");

    User.findOne({
        email: email,
        password: hash
    }, (error, user) => {
        if (error) {
            res.send(400);
        } else {
            if (user != null) {
                req.session["userId"] = user._id;
                res.redirect("/");
            } else {
                res.render("login", {errorMessage: "Invalid username/password"});
            }
        }
    });
}

function logout(req:express.Request, res:express.Response) {
    req.session.destroy((err:any) => {
        if (err) {
            console.error("Error occured during session destroy.");
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    });
}

export {signupIndex, signup, verifySession, login, loginIndex, logout}
