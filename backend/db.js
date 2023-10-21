import mysql from "mysql2/promise";

class MySQLClient {
  constructor() {
    this.pool = null;
  }

  async connect() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DATABASE,
    });
    const conn = await this.pool.getConnection();
    conn.release();
    console.log(`Connectedt to DB`);
  }
}

const mysqlClient = new MySQLClient();
export { mysqlClient };
