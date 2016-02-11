"use strict";

import * as express from "express";
import * as routes from "./routes/index";
import * as maps from "./routes/maps";
import * as account from "./routes/account";
import * as session from "express-session";
import config from "./Config";
import * as mongoose from "mongoose";
import * as handlebars from 'express-handlebars';

mongoose.connect(config.mongoConnection);

let app = express();
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
    secret: config.sessionSecret
}));

app.use(express.static('public'));

// use body parser so we can get info from POST and/or URL parameters
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/login", account.loginIndex);
app.post("/login", account.login);

app.get("/logout", account.logout);

var authenticatedRoutes = express.Router();
authenticatedRoutes.use(account.verifySession);
authenticatedRoutes.get("/", routes.index);
authenticatedRoutes.get("/maps", maps.index);

app.use("/", authenticatedRoutes);

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
