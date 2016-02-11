"use strict";
var express = require("express");
var routes = require("./routes/index");
var maps = require("./routes/maps");
var account = require("./routes/account");
var session = require("express-session");
var Config_1 = require("./Config");
var mongoose = require("mongoose");
var handlebars = require('express-handlebars');
mongoose.connect(Config_1.default.mongoConnection);
let app = express();
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(session({
    secret: Config_1.default.sessionSecret
}));
app.use(express.static('public'));
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
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
