import mysql, { ConnectionOptions } from 'mysql2/promise';
const access: ConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: '$UM!T376mysql',
  database: 'next_stock',
  port: 3306,
  waitForConnections: true,
};
const connectDB = async () => {
  try {
    const connection = await mysql.createPool(access);
    console.log('Successfully connected to MySQL 🥂');
    // console.log(connection.getConnection())
    return connection.getConnection()
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message }`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
};

export default connectDB;