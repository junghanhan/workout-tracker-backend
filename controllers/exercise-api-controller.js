import { query } from "../db.js";

const getAllExercises = async (req, res) => {
  try {    
    const exercises = await query("SELECT exercise_id, exercise_name FROM exercise");
    res.status(200).json(exercises);
  } 
  catch (err) {
    res.status(400).send("Bad Request");
  }
};



export { getAllExercises };