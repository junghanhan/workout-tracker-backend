import { query } from "../db.js";

// datetime should be in the MySQL date format "%Y-%m-%d"
const generateLogSQL = (datetime) => {
  return (
    `SELECT e.exercise_name, le.set_number, le.weight, le.rep
    FROM log_entry le
    INNER JOIN log l ON l.log_id = le.log_id
    INNER JOIN exercise e ON e.exercise_id = le.exercise_id
    WHERE l.datetime = STR_TO_DATE("${datetime}","%Y-%m-%d")`
  );
}

const getLog = async (req, res) => {
  try {    
    // TODO: query string validation
    let logSQL = generateLogSQL(req.query.datetime);
    let log = await query(logSQL);    
    res.status(200).json(log);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export { getLog };