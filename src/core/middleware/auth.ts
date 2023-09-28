import {Router, Request, Response, NextFunction} from "express";
import {UnauthorizedError} from "../errors/user";
// we create a middleware to check if the user is logged in
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // we check if the session is set and if the username is set
        const me = req.session.Me;

        if(me && me.username.length > 0){
            next();
        } else {
            throw new UnauthorizedError("You must be logged in");
        }
    } catch (err: any) {
        // we destroy the sessin
        req.session.destroy((err) => {console.log("Session destruction error",err)});
        // we send the error 
        next(err);
    }
};

// we check if the user is logged in and if the user is an admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // we check if the session is set and if the username is set
        const me = req.session.Me;

        if(me && me.isAdmin && me.username.length > 0){
            next();
        } else {
            throw new UnauthorizedError("You're not admin");
        }
    } catch (err: any) {
        // we destroy the sessin
        req.session.destroy((err) => {console.log("Session destruction error",err)});
        // we send the error 
        next(err);
    }
};
