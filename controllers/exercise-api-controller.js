import { getAllExercises } from "../db.js";

const getAllExercisesHandler = async (req, res) => {
  try {    
    const exercises = await getAllExercises();
    res.status(200).json(exercises);
  } 
  catch (err) {
    res.status(400).send("Bad Request");
  }
};



export { getAllExercisesHandler };