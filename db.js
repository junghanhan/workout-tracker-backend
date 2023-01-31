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


export { query };