import express, { Request, Response, NextFunction, Router } from "express";
import { insertNewUser, getAllUsers } from "../mongo/user";
import { Me } from "../models/me";

const router: Router = express.Router();
router.get("/ping", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.Me) {
      console.log(req.session.Me);
    } else {
      let me = new Me();
      me.username = "guest";
      me.isAdmin = true;
      req.session.Me = me;
      res.json("pong");
    }
    res.json("done");
  } catch (err) {
    console.log(err);
  }
});

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.body.username;
      let password = req.body.password;
      let birthday = req.body.birthday;
      if (req.session.Me && req.session.Me.isAdmin) {
        if (username && username.length > 0) {
          if (password && password.length > 0) {
            let newUser = await insertNewUser(username, password, birthday);
            if (newUser) {
              res.json(newUser);
            }
          } else {
            res.json("You need to send a password");
          }
        } else {
          res.json("You need to send a username");
        }
      } else {
        res.json("You must be an admin that is logged in");
      }
    } catch (err) {
      console.log("error: ", err);
    }
  }
);
//get all users
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.Me && req.session.Me.isAdmin) {
      let users = await getAllUsers();
      res.json(users);
    } else {
      res.json("You must be an admin that is logged in");
    }
  } catch (err) {
    console.log("error: ", err);
  }
});

export default router;
