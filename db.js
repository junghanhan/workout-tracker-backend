import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

const query = async (sql, params) => {
  const [results,] = await pool.execute(sql, params);

  return results;
};

const getAllExercises = async () => {
  const exercises = await query("SELECT exercise_id, exercise_name FROM exercise");
  return exercises;
};

// datetime should be in the MySQL date format "%Y-%m-%d"
const getLog = async (datetime) => {
  const logData = await query(`SELECT e.exercise_id, e.exercise_name, le.set_number, le.weight, le.rep
    FROM log_entry le
    INNER JOIN log l ON l.log_id = le.log_id
    INNER JOIN exercise e ON e.exercise_id = le.exercise_id
    WHERE l.datetime = STR_TO_DATE(? ,"%Y-%m-%d")`, [datetime]);

  return logData;
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

const saveLog = async (log, datetime) => {
  // check whether the log on the date already exists        
  const existingLogID = await query(`
    SELECT log_id
    FROM log 
    WHERE datetime = STR_TO_DATE(? ,"%Y-%m-%d")`, [datetime]);

  // if it already exists, delete original one
  if (existingLogID.length > 0) {
    existingLogID.forEach((value) => {
      deleteLog(value.log_id);
    });
  }

  // insert new log
  const { insertId } = await query(
    "INSERT INTO log (datetime) VALUES (?)",
    [datetime]);

  // insert new log entries  
  for (const exercise of log) {
    for (let i = 0; i < exercise.sets.length; i++) {
      await query(
        "INSERT INTO log_entry (log_id, exercise_id, set_number, weight, rep) VALUES (?, ?, ?, ?, ?)",
        [insertId, exercise.exerciseId, i + 1, exercise.sets[i].weight, exercise.sets[i].rep]);
    };
  };
};



export { query, getAllExercises, getLog, deleteLog, saveLog };