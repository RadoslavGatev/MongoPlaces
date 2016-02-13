"use strict";

import * as express from "express";
import * as routes from "./routes/index";
import * as maps from "./routes/maps";
import * as places from "./routes/places";
import * as account from "./routes/account";
import * as session from "express-session";
import config from "./Config";
import * as mongoose from "mongoose";
import * as handlebars from 'express-handlebars';

mongoose.connect(config.mongoConnection);

let app = express();
app.engine('handlebars', handlebars({
    defaultLayout: 'main', helpers: {
        toJSON: (object:any)=> {
            return JSON.stringify(object);
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(session({
    secret: config.sessionSecret
}));

app.use(express.static('public'));

// use body parser so we can get info from POST and/or URL parameters
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


function logErrors(err:any, req:express.Request, res:express.Response, next:express.NextFunction) {
    console.error(err.stack);
    next(err);
}

app.use(logErrors);

function errorHandler(err:any, req:express.Request, res:express.Response, next:express.NextFunction) {
    res.status(500);
    res.render('error', {error: err});
}

app.use(errorHandler);


app.get("/login", account.loginIndex);
app.post("/login", account.login);

app.get("/logout", account.logout);

var authenticatedRoutes = express.Router();
authenticatedRoutes.use(account.verifySession);
authenticatedRoutes.get("/", places.index);
authenticatedRoutes.get("/maps", maps.index);

authenticatedRoutes.get("/places/add", places.addGet);
authenticatedRoutes.post("/places/add", places.addPost);
authenticatedRoutes.get("/places", places.showAllPlaces);
authenticatedRoutes.get("/places/like", places.likePlace);
authenticatedRoutes.get("/places/info", places.getInformationalWindow);

authenticatedRoutes.get("/places/byType", places.showByType);
authenticatedRoutes.get("/places/nearestNeighbours", places.showNearestNeighbours);


app.use("/", authenticatedRoutes);

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
