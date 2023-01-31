import { query } from "../db.js";


const getLogData = async (req, res) => {
  try {
    // TODO: request params validation needed    
    // datetime should be in the MySQL date format "%Y-%m-%d"
    const logData = await query(`SELECT e.exercise_id, e.exercise_name, le.set_number, le.weight, le.rep
    FROM log_entry le
    INNER JOIN log l ON l.log_id = le.log_id
    INNER JOIN exercise e ON e.exercise_id = le.exercise_id
    WHERE l.datetime = STR_TO_DATE(? ,"%Y-%m-%d")`,[req.params.datetime]);     
    res.status(200).json(logData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

const deleteLog = async (logID) => {    
  let result = await query(`
    DELETE 
    FROM log_entry
    WHERE log_id = ?`, [logID]);  
  result = await query(`
    DELETE 
    FROM log 
    WHERE log_id = ?`, [logID]);  
};

const saveLog = async (req, res) => {
  try {
    // TODO: request body property validation needed
    // check whether the log on the date already exists        
    const existingLogID = await query(`SELECT log_id
    FROM log 
    WHERE datetime = STR_TO_DATE(? ,"%Y-%m-%d")`, [req.body.datetime]);

    // if it already exists, delete original one
    if (existingLogID.length > 0) {
      existingLogID.forEach((value)=> {        
        deleteLog(value.log_id);      
      });      
    }
    
    // insert new log
    const { insertId } = await query(
      "INSERT INTO log (datetime) VALUES (?)",
      [req.body.datetime]);        
    
    // insert new log entries
    const log = req.body.log;        
    for(const exercise of log) {                  
      for(let i = 0; i < exercise.sets.length; i++) {        
        await query(
          "INSERT INTO log_entry (log_id, exercise_id, set_number, weight, rep) VALUES (?, ?, ?, ?, ?)",
          [insertId, exercise.exerciseId, i+1, exercise.sets[i].weight, exercise.sets[i].rep]);
      };
    };    

    res.status(201).json(req.body);
  } catch (err) {
    console.log(err); 
    res.status(400).send("Bad Request");
  }
};

export { getLogData, saveLog };