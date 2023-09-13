import express, { Request, Response, NextFunction, Router } from "express";
import { insertNewUser } from "../mongo/user";
import { Me } from "../models/me";

const router: Router = express.Router();
router.get("/ping", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.session)
    if(req.session.Me){
      console.log(req.session.Me);
    
    }
    else{
      let me = new Me();
      me.username = 'guest';
      me.isAdmin = false;
      req.session.Me = me;
      res.json('pong')
    }
    res.json("done");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    let username = req.body.username;
    let password = req.body.password;
    let birthday = req.body.birthday;

    if(req.session.Me && req.session.Me.isAdmin){

    if (username && username.length > 0) {
      if (password && password.length >= 8) {
        let newUser = await insertNewUser(
          username,
          password,
          new Date(birthday)
        );
        if (newUser) {
          res.json(newUser);
        } else {
          res.status(400).json({ message: "Cannot create new user" });
        }
      } else {
        res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }
    } else {
      res.status(400).json({ message: "Username cannot be empty" });
    }
  } else {
    res.status(400).json({ message: "You are not admin" });
  }

}
);

export default router;
