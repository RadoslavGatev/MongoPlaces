"use strict";

import * as express from "express";
import User from "../models/User";
import {NextFunction} from "express";

import * as crypto from "crypto";
import config from "../Config";

// function setup(req:express.Request, res:express.Response) {
//
//     // create a sample user
//     var nick = new User({
//         name: 'Nick Cerminara',
//         password: 'password',
//         // places: []
//     });
//
//     // save the sample user
//     nick.save(function (err) {
//         if (err) throw err;
//
//         console.log('User saved successfully');
//         res.json({success: true});
//     });
// }

function verifySession(req:express.Request, res:express.Response, next:NextFunction) {
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
        if(err){
            console.error("Error occured during session destroy.");
            res.redirect("/");
        } else{
            res.redirect("/login");
        }
    });
}

export {verifySession, login, loginIndex, logout}
