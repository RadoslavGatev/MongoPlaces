"use strict";
var express = require("express");
var routes = require("./routes/index");
var maps = require("./routes/maps");
var exphbs = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.get("/", routes.index);
app.get("/maps", maps.index);
app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});
