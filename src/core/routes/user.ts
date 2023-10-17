import express, { Request, Response, NextFunction, Router } from "express";
import { insertNewUser, getAllUsers, getUserbyUsername, getUserbyId, changeUserToAdmin } from "../mongo/user";
import { Me } from "../models/me";
import bycrpt from "bcrypt";
import { MongoInsertError } from "../errors/mongo";
import { BadRequestError, UnauthorizedError } from "../errors/user";
import { isAdmin, isLoggedIn } from "../middleware/auth";
import { ensureObjectID } from "../config/utils/mongohelper";

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

//create new user
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.body.username;
      let password = req.body.password;
      let birthday = req.body.birthday;
      let isAdmin = req.body.isAdmin;
      // if (req.session.Me && req.session.Me.isAdmin) {
        if (username && username.length > 0) {
          if (password && password.length > 0) {
            let newUser = await insertNewUser(username, password, birthday, isAdmin);
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
      } 
    catch (err) {
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
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
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
          me.isAdmin = currentUser.isAdmin;
          me._id = currentUser._id;
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


//ADMIN ROUTES
//all users
router.get('/users', isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
//change users to admin
router.patch('/edituser', isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.body.userId;
    let isAdmin = req.body.isAdmin;
    if(userId && userId.length > 0){
      userId = ensureObjectID(userId);
      isAdmin = isAdmin ? true : false;
      let user = await getUserbyId(userId);
      if(user){
        let result = await changeUserToAdmin(userId, isAdmin);
        if(result){
          res.json("User updated");
        } else {
          throw new BadRequestError("Something went wrong");
        }
      } else {
        throw new BadRequestError("User does not exist");
      }
    } else {
      throw new BadRequestError("You need to send a userId");
    }
  } catch (err) {
    next(err);
  }
});

//logout for all
router.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.Me) {
      req.session.destroy((err) => {
        if (err) {
          throw new BadRequestError("Something went wrong");
        } else {
          res.json("logged out");
        }
      });
    } else {
      res.json("You are not logged in");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
