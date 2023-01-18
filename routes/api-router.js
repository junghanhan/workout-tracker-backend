import express from "express";
import { getLog } from "../controllers/log-api-controller.js";
// import passport from "passport";

const router = express.Router();

router
  .route("/log")
  .get(getLog);  
  

export default router;
