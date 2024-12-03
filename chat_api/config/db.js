import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust the limit based on your needs
    queueLimit: 0
});

// Test the database connection
const testDbConnection = async () => {
    try {
      const connection = await db.getConnection(); // Get a connection from the pool
      console.log('Database connection established successfully');
      connection.release(); // Release the connection back to the pool
    } catch (error) {
      console.error('Failed to connect to the database:', error.message);
      process.exit(1); // Exit the process with a failure code
    }
  };
  
// Test the database connection on startup
testDbConnection();

export default db;
