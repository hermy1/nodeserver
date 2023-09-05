import express, { Request, Response, NextFunction } from "express";
import userRoutes from './core/routes/user'
import * as http from "http";

interface MainOptions {
  port: number;
}

export async function main(options: MainOptions) {
  try {
    const app = express()
    app.use('/user',userRoutes);

    const server = http.createServer(app)
    server.listen(options.port)
  } catch (err) {

  }
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
