"use strict";

import * as express from "express";
import * as mongoose from "mongoose";

import * as routes from "./routes/index";
import * as maps from "./routes/maps";
import * as places from "./routes/places";
import * as account from "./routes/account";

import * as session from "express-session";
import * as handlebars from "express-handlebars";

import config from "./Config";

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

function loggedMiddleware(req:express.Request, res:express.Response, next:express.NextFunction) {
    let userId = req.session["userId"];
    res.locals.isLoggedIn = (userId) ? true : false;

    // keep executing the router middleware
    next();
}
app.use(loggedMiddleware);

app.get("/login", account.loginIndex);
app.post("/login", account.login);

app.get("/signup", account.signupIndex);
app.post("/signup", account.signup);

app.get("/logout", account.logout);

let authenticatedRoutes = express.Router();
authenticatedRoutes.use(account.verifySession);
authenticatedRoutes.get("/", places.index);
authenticatedRoutes.get("/maps", maps.index);

authenticatedRoutes.get("/places/add", places.addGet);
authenticatedRoutes.post("/places/add", places.addPost);
authenticatedRoutes.get("/places", places.showAllPlaces);
authenticatedRoutes.post("/api/places/like", places.likePlace);
authenticatedRoutes.post("/api/places/unlike", places.unlikePlace);

authenticatedRoutes.get("/places/info", places.getInformationalWindow);

authenticatedRoutes.get("/places/byType", places.showByType);
authenticatedRoutes.get("/places/nearestNeighbours", places.showNearestNeighbours);
authenticatedRoutes.get("/places/showSimiliar", places.showSimiliar);

app.use("/", authenticatedRoutes);



app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
