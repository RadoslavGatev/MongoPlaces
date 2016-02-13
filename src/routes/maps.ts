"use strict";

import * as express from "express";

function index(req: express.Request, res: express.Response) {
    res.render('index', {layout: "main", body: "maps"});
}

export {index}
