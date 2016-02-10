"use strict";

import * as express from "express";
import * as routes from "./routes/index";
import * as maps from "./routes/maps";


let exphbs = require('express-handlebars');

let app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get("/", routes.index);
app.get("/maps", maps.index);

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});


//import * as express from "express";
//let express = require("express")
//import * as routes from "./routes/main.handlebars";
//import * as http from "http";
//import * as path from "path";
//
//var app = express();
//
//// all environments
//app.set("port", process.env.PORT || 3000);
//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "jade");
//app.use(express.favicon());
//app.use(express.logger("dev"));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
//
//import stylus = require("stylus");
//app.use(stylus.middleware(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "public")));
//
//// development only
//if ("development" == app.get("env")) {
//    app.use(express.errorHandler());
//}
//
//app.get("/", routes.main.handlebars);
//app.get("/about", routes.about);
//app.get("/contact", routes.contact);
//
//http.createServer(app).listen(app.get("port"), function () {
//    console.log("Express server listening on port " + app.get("port"));
//});

