import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import userRoutes from "./core/routes/user";
import * as http from "http";
import session from "express-session";
import { Me } from "./core/models/me";
import config from "./core/config";

interface MainOptions {
  port: number;
}

declare module "express-session" {
  interface SessionData {
    Me: Me;
  }
}
export async function main(options: MainOptions) {
  try {
    const app = express();
    //set body parser and limit size for attacks
    app.use(bodyParser.json({ limit: "5mb" }));
    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
    const sess = session({
      secret: config.server.secret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 6000000 },
    });
    //set session
    app.use(sess);
    //set routes
    app.use("/user", userRoutes);

   
  


    //start server
    const server = http.createServer(app);
    server.listen(options.port);
  } catch (err) {}
}

if (require.main === module) {
  const PORT = 7000;
  main({ port: PORT })
    .then(() => {
      console.log("started successfuly");
    })
    .catch(() => {
      console.log("Something went wrong");
    });
}
