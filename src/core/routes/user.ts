import express, { Request, Response, NextFunction, Router } from "express";
const router: Router = express.Router();
router.get("/ping", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('pongs');
  } catch (err) {
    next(err)
  }
});

export default router