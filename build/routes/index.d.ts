import * as express from "express";
declare function index(req: express.Request, res: express.Response): void;
declare function about(req: express.Request, res: express.Response): void;
declare function contact(req: express.Request, res: express.Response): void;
export { index, about, contact };
