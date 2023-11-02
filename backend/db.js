import mysql from "mysql2/promise";

class MySQLClient {
  static pool;

  async connect() {
    MySQLClient.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DATABASE,
    });
    (await MySQLClient.pool.getConnection()).release();
    console.log(`Connectedt to DB`);
  }

  /**
   * @abstract
   */
  #insert() {}

  /**
   * @abstract
   */
  #select() {}

  /**
   * @abstract
   */
  #update() {}

  /**
   * @abstract
   */
  #delete() {}
}

export class Video extends MySQLClient {
  static insert() {}
  static select() {}
  static update() {}
  static delete() {}
}

export class Image extends MySQLClient {
  static insert() {}
  static select() {}
  static update() {}
  static delete() {}
}

const mysqlClient = new MySQLClient();
export default mysqlClient;
