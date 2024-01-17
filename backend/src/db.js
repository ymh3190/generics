import mysql from "mysql2/promise";
import * as CustomError from "./error";

class MySQLAPI {
  static pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
  // static table;

  async connect() {
    (await MySQLAPI.pool.getConnection()).release();
    console.log(`Connected to DB`);
  }

  static getTable() {
    let name = "";
    for (let i = 0, len = this.name.length; i < len; ++i) {
      if (this.name[i] !== this.name[i].toUpperCase()) {
        name += this.name[i];
        continue;
      }
      if (i !== 0) {
        name += `_${this.name[i].toLowerCase()}`;
        continue;
      }
      name += this.name[i].toLowerCase();
    }
    return name;
  }

  /**
   *
   * @param {{}} filter
   * @param {{}} options
   */
  static async create(filter, options) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const table = this.getTable();

    let sql = `INSERT INTO ${table}(`;
    const keys = Object.keys(filter);
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(keys[i], ", ");
        continue;
      }
      sql = sql.concat(keys[i], ") VALUES(");
    }
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat("?, ");
        continue;
      }
      sql = sql.concat("?)");
    }
    const values = Object.values(filter);
    await MySQLAPI.pool.execute(sql, values);

    if (!options) {
      return;
    }

    for (const [key, value] of Object.entries(options)) {
      if (key.includes("new") && value) {
        const id = [values[0]];
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        const [[result]] = await MySQLAPI.pool.execute(sql, id);
        return result;
      }
    }
  }

  /**
   *
   * @param {{}} filter
   */
  static async select(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const table = this.getTable();

    const keys = Object.keys(filter);
    if (!keys.length) {
      const sql = `
      SELECT *, ${createdAt} FROM ${table}
      `;

      const [result] = await MySQLAPI.pool.execute(sql);
      return result;
    }

    let sql = `SELECT *, ${createdAt} FROM ${table} WHERE`;
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(filter);
    const [result] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {string} id
   */
  static async selectById(id) {
    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const table = this.getTable();

    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    const values = [id];
    const [[result]] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {{}} filter
   */
  static async selectOne(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const table = this.getTable();

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `SELECT * FROM ${table} WHERE`;
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(filter);
    const [[result]] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {{}} filter
   */
  static async selectOneAndDelete(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const table = this.getTable();

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `DELETE FROM ${table} WHERE`;
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(filter);
    await MySQLAPI.pool.execute(sql, values);
  }

  /**
   *
   * @param {string} id
   * @param {{}} filter
   * @param {{}} options
   */
  static async selectByIdAndUpdate(id, filter, options) {
    if (!id || !filter) {
      throw new CustomError.BadRequestError("Provide id and filter");
    }

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    const table = this.getTable();

    const result = await this.selectById(id);
    if (!result) {
      throw new CustomError.NotFoundError(`${table} not found`);
    }

    let sql = `UPDATE ${table} SET`;
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(" ", keys[i], " = ?,");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ? WHERE").concat(" ", "id = ?");
    }

    let values = [...Object.values(filter), id];
    await MySQLAPI.pool.execute(sql, values);

    if (!options) {
      return;
    }

    for (const [key, value] of Object.entries(options)) {
      if (key.includes("new") && value) {
        const id = values.at(-1);
        const result = await this.selectById(id);
        return result;
      }
    }
  }

  /**
   *
   * @param {string} id
   */
  static async selectByIdAndDelete(id) {
    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const table = this.getTable();

    const result = await this.selectById(id);
    if (!result) {
      throw new CustomError.NotFoundError(`${table} not found`);
    }

    const sql = `DELETE FROM ${table} WHERE id = ?`;
    const values = [id];
    await MySQLAPI.pool.execute(sql, values);
  }
}

const mysqlAPI = new MySQLAPI();
export default mysqlAPI;
// User.table = User.getTable();
export class User extends MySQLAPI {}
export class Token extends MySQLAPI {}
export class WorkOrder extends MySQLAPI {}
export class WorkDetail extends MySQLAPI {}
export class WorkLog extends MySQLAPI {}
export class Video extends MySQLAPI {}
export class Image extends MySQLAPI {}
export class Item extends MySQLAPI {}
export class Client extends MySQLAPI {}
