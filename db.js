import mysql from "mysql2/promise";
import dayjs from "dayjs";

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

// delete log entries(sets) and log using mysql transaction
const deleteLog = async (logID) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.execute(`
      DELETE 
      FROM log_entry
      WHERE log_id = ?`, [logID]);
    await conn.execute(`
      DELETE 
      FROM log 
      WHERE log_id = ?`, [logID]);
    await conn.commit();
  }
  catch (err) {
    conn.rollback();
    console.log("Rollback successful");
    throw err;
  }
};

// save log using mysql transaction
const saveLog = async (log, datetime) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
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

    // insert new log only if there is log entries
    if (log.length > 0) {
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
    }

    await conn.commit();
  }
  catch (err) {
    conn.rollback();
    console.log("Rollback successful");
    throw err;
  }
};

const getWorkoutDays = async (datetime) => {
  let workoutDays = await query(`SELECT datetime
    FROM log 
    WHERE datetime 
    BETWEEN DATE_ADD(DATE_ADD(LAST_DAY(?),INTERVAL 1 DAY),INTERVAL -1 MONTH)
    AND LAST_DAY(?)`,
    [datetime, datetime]);

  workoutDays = workoutDays.map((obj) => Number(dayjs(obj.datetime).format('D')));
  return workoutDays;
};


export { getAllExercises, getLog, deleteLog, saveLog, getWorkoutDays };