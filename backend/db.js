import mysql from "mysql2/promise";

class MySQLClient {
  static pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    connectionLimit: 4,
  });

  async connect() {
    (await MySQLClient.pool.getConnection()).release();
    console.log(`Connectedt to DB`);
  }

  /** @abstract */
  #insert() {}

  /** @abstract */
  #select() {}

  /** @abstract */
  #update() {}

  /** @abstract */
  #delete() {}
}

export class Video extends MySQLClient {
  constructor() {
    super();
  }
  static insert() {}

  static async select(query) {
    if (!query) return;
    const keys = Object.keys(query);
    if (!keys.length) {
      const sql = "SELECT id, path FROM video";
      const [result] = await MySQLClient.pool.execute(sql);
      return result;
    }
    let sql = "SELECT id, path FROM video WHERE";
    const keysLength = keys.length - 1;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keysLength) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(query);
    const [result] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

  static async selectById(id) {
    const sql = "SELECT id, path FROM video WHERE id = ?";
    const values = [id];
    const [[result]] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

  static update() {}

  static delete() {}
}

export class Image extends MySQLClient {
  static insert() {}

  static async select(query) {
    if (!query) return;
    const keys = Object.keys(query);
    if (!keys.length) {
      const sql = "SELECT id, path FROM image";
      const [result] = await MySQLClient.pool.execute(sql);
      return result;
    }
    let sql = "SELECT id, path FROM image WHERE";
    const keysLength = keys.length - 1;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keysLength) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(query);
    const [result] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

  static update() {}
  static delete() {}
}

const mysqlClient = new MySQLClient();
export default mysqlClient;
