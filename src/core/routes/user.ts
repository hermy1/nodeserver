import express, { Request, Response, NextFunction, Router } from "express";
import { insertNewUser, getAllUsers, getUserbyUsername } from "../mongo/user";
import { Me } from "../models/me";
import bycrpt from "bcrypt";
import { MongoInsertError } from "../errors/mongo"; 
import { BadRequestError, UnauthorizedError } from "../errors/user";
import { isAdmin, isLoggedIn } from "../middleware/auth";

const router: Router = express.Router();
//test route
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

//no admin test middle auth
router.get("/notadmin", isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json ("we re logged in but not admin")
  } catch (err) {
    console.log(err);
  }
});
//admin test middle auth
router.get("/isadmin", isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json ("we re logged in and we're admin")
  } catch (err) {
    console.log(err);
  }
});

//both test middle auth
router.get("/both", isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json ("we re logged in and we're admin")
  } catch (err) {
    console.log(err);
  }
});

//create new user
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
            } else {
              // res.json("Something went wrong");
              throw new MongoInsertError("Something went wrong");
            }
          } else {
            // res.json("You need to send a password");
            throw new BadRequestError("You need to send a password");
          }
        } else {
          // res.json("You need to send a username");
          throw new BadRequestError("You need to send a username");

        }
      } else {
        // res.json("You must be an admin that is logged in");
        throw new UnauthorizedError("You must be an admin that is logged in");
      }
    } catch (err) {
      next(err);
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


//login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.body.username;
      let password = req.body.password;
      let currentUser = await getUserbyUsername(username);
      if (currentUser) {
        let isPasswordCorrect = await bycrpt.compare(
          password,
          currentUser.password
        );
        if (isPasswordCorrect) {
          let me = new Me();
          me.username = currentUser.username;
          me.isAdmin = false;
          req.session.Me = me;
          res.json("logged in");
        } else {
          res.json("combination is incorrect");
        }
      } else {
        res.json("The user doesn not exist");
      }
    } catch (err) {
      res.json("Something went wrong");
    }
  }
);

export default router;
