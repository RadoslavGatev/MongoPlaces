"use strict";

import User from "../models/User";
import Place from "../models/Place";


/*
 * GET home page.
 */
import * as express from "express";

function about(req:express.Request, res:express.Response) {
    res.render('about', {title: 'About', year: new Date().getFullYear(), message: 'Your application description page'});
}

function contact(req:express.Request, res:express.Response) {
    res.render('contact', {title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page'});
}

export { about, contact}

