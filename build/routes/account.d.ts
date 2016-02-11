import * as express from "express";
import { NextFunction } from "express";
declare function verifySession(req: express.Request, res: express.Response, next: NextFunction): void;
declare function loginIndex(req: express.Request, res: express.Response): void;
declare function login(req: express.Request, res: express.Response): void;
declare function logout(req: express.Request, res: express.Response): void;
export { verifySession, login, loginIndex, logout };
