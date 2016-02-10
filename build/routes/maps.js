"use strict";
function index(req, res) {
    res.render('index', { layout: "main", body: "maps" });
}
exports.index = index;
