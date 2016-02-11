"use strict";
var mongoose = require('mongoose');
var mongoose_1 = require("mongoose");
var userSchema = new mongoose.Schema({
    name: mongoose_1.Schema.Types.String,
    password: mongoose_1.Schema.Types.String,
    places: [mongoose_1.Schema.Types.ObjectId]
});
let User = mongoose.model("User", userSchema);
exports.default = User;
