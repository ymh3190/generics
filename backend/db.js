import mysql from "mysql2/promise";

class MySQLClient {
  constructor() {
    this.pool;
  }

  init() {
    this.insert();
    this.select();
    this.update();
    this.delete();
    return this;
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

  /**
   * @abstract
   */
  insert() {}

  /**
   * @abstract
   */
  select() {}

  /**
   * @abstract
   */
  update() {}

  /**
   * @abstract
   */
  delete() {}
}

export class Video extends MySQLClient {
  constructor() {}

  static insert() {}
  static select() {}
  static update() {}
  static delete() {}
}

export class Image extends MySQLClient {
  constructor() {}

  static insert() {}
  static select() {}
  static update() {}
  static delete() {}
}

const mysqlClient = new MySQLClient().init();
export default mysqlClient;
