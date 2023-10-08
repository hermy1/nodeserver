import { Router, Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/user";

//if user is logged
export const isLoggedIn = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const me = req.session.Me;
        if(me && me.username && me.username.length > 0){
            next();
        } else {
            throw new UnauthorizedError('You must be logged in');
        }

    } catch (err) {
        req.session.destroy((err) => {
            if(err){
                console.log(err);
            }
        });
        next(err);
    }
};

//is admin
export const isAdmin = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const me = req.session.Me;
        if(me && me.username && me.username.length > 0 && me.isAdmin){
            next();
        } else {
            throw new UnauthorizedError('You must be an admin');
        }

    } catch (err) {
        req.session.destroy((err) => {
            if(err){
                console.log(err);
            }
        });
        next(err);
    }
};

