import express from "express";
import { getAllExercises } from "../controllers/exercise-api-controller.js";
import { getLogData, saveLog } from "../controllers/log-api-controller.js";
// import passport from "passport";

const router = express.Router();

router
  .route("/log")
  .post(saveLog);

router
  .route("/log/:datetime")
  .get(getLogData);    

router
  .route("/exercises")
  .get(getAllExercises);

export default router;
