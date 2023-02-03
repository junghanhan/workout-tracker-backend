import express from "express";
import { getAllExercisesHandler } from "../controllers/exercise-api-controller.js";
import { getLogHandler, saveLogHandler, getWorkoutDaysHandler } from "../controllers/log-api-controller.js";
// import passport from "passport";

const router = express.Router();

router
  .route("/log")
  .post(saveLogHandler);

router
  .route("/log/:datetime")
  .get(getLogHandler);

router
  .route("/log/workout_days/:datetime")
  .get(getWorkoutDaysHandler);

router
  .route("/exercises")
  .get(getAllExercisesHandler);



export default router;
