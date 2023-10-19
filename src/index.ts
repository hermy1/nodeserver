import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import userRoutes from "./core/routes/user";
import * as http from "http";
import session from "express-session";
import { Me } from "./core/models/me";
import config from "./core/config";
import User from "./core/models/user";
import { UserError } from "./core/errors/base";
import MongoStore  from 'connect-mongo';
import winston from 'winston';
import { logger } from "./core/config/utils/logger";


interface MainOptions {
  port: number;
  env?: string;
}

declare module "express-session" {
  interface SessionData {
    Me: Me;
  }
}
export async function main(options: MainOptions) {
  try {
    //logger
    if (options.env === "development") {
      winston.addColors(config.logging.colors);
      // logger.add(new winston.transports.Console({ format: winston.format.simple() }));
    } else {
      logger.add(new winston.transports.File({ filename: config.logging.file, level: config.logging.level }));
    }

    const app = express();
    //mongo store for session
    const mongoStore = MongoStore.create({
      mongoUrl: config.server.mongoConnect,
    })
  
    //set body parser and limit size for attacks
    app.use(bodyParser.json({ limit: "5mb" }));
    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
    const sess = session({
      secret: config.server.secret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 6000000 },
      //creates new store for session in mongo
      store : mongoStore
    });
    //set session
    app.use(sess);

    //set routes
    app.use("/user", userRoutes);

    //set error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      //check error type
      if(err instanceof UserError){
        res.status(err.statusCode).send({message: err.message});
      } else {
        res.status(500).send({message: "A server error has occured"});
      }
      // console.log('theere was a problem',err.message);
      logger.log({level: 'error', message: `There was a problem ${err.message}`});
      
    });

   
    //start server
    const server = http.createServer(app);
    server.listen(options.port);
  } catch (err) {}
}

if (require.main === module) {
  const PORT = 7000;
  const ENV = process.env.NODE_ENV ?? "development";
  main({ port: PORT, env: ENV })
    .then(() => {
      // console.log("started successfuly" );
      logger.log({level: 'info', message: `started successfuly`});
    })
    .catch((err) => {
      // console.log("Something went wrong");
      logger.log({level: 'emerg', message: `Something went wrong ${err}`});
    });
}
