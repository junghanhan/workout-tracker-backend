import mysql from "mysql2/promise";

const query = async (sql, params) => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });  

  const [results, ] = await connection.execute(sql, params);  

  await connection.end();

  return results;
};


export { query };