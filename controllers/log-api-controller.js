import { getLog, getWorkoutDays, saveLog } from "../db.js";


const getLogHandler = async (req, res) => {
  try {
    // TODO: request params validation needed    
    // datetime should be in the MySQL date format "%Y-%m-%d"
    const log = await getLog(req.params.datetime);    
    res.status(200).json(log);
  } catch (err) {
    console.log(err); 
    res.status(400).send("Bad Request");
  }
};

const saveLogHandler = async (req, res) => {
  try {
    // TODO: request body property validation needed
    await saveLog(req.body.log, req.body.datetime);
    res.status(201).json(req.body);
  } catch (err) {
    console.log(err); 
    res.status(400).send("Bad Request");
  }
};

const getWorkoutDaysHandler = async (req, res) => {
  try {
    // TODO: request params validation needed    
    const workoutDays = await getWorkoutDays(req.params.datetime);
    res.status(200).json(workoutDays);
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export { getLogHandler, saveLogHandler, getWorkoutDaysHandler };