"use strict";

/*
 * GET home page.
 */
import * as express from "express";

function index(req: express.Request, res: express.Response) {

    res.render('index', {layout: "main", test: "raboti"});
}

function about(req: express.Request, res: express.Response) {
    res.render('about', {title: 'About', year: new Date().getFullYear(), message: 'Your application description page'});
}

function contact(req: express.Request, res: express.Response) {
    res.render('contact', {title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page'});
}

export {index, about, contact}

