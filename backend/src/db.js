import mysql from "mysql2/promise";
import * as CustomError from "./error";
import util from "./util";

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
    for (let i = 0; i < this.name.length; i++) {
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
   */
  static async createByManualId(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const table = this.getTable();

    let sql = `INSERT INTO ${table}(`;
    const keys = Object.keys(filter);
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(keys[i], ", ");
        continue;
      }
      sql = sql.concat(keys[i], ") VALUES(");
    }
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat("?, ");
        continue;
      }
      sql = sql.concat("?)");
    }
    const values = Object.values(filter);
    await MySQLAPI.pool.execute(sql, values);
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
    const id = util.createId();

    let sql = `INSERT INTO ${table}(`.concat("id, ");
    const keys = Object.keys(filter);
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(keys[i], ", ");
        continue;
      }
      sql = sql.concat(keys[i], ") VALUES(").concat("?, ");
    }
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat("?, ");
        continue;
      }
      sql = sql.concat("?)");
    }
    const values = [id, ...Object.values(filter)];
    await MySQLAPI.pool.execute(sql, values);

    if (!options) {
      return;
    }

    for (const [key, value] of Object.entries(options)) {
      if (key === "new" && value) {
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        const values = [id];
        const [[result]] = await MySQLAPI.pool.execute(sql, values);
        return result;
      }
    }
  }

  /**
   *
   * @param {{}} filter
   * @param {string} projection
   */
  static async select(filter, projection) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const asCreatedAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    `;

    // const asEndDate = `
    // DATE_FORMAT(end_date, '%Y-%m-%d %H:%i:%s') AS end_date
    // `;

    const table = this.getTable();

    const keys = Object.keys(filter);
    if (!keys.length) {
      let sql = `SELECT *, ${asCreatedAt} FROM ${table}`;
      // let sql = `SELECT *, ${asCreatedAt}, ${asEndDate} FROM ${table}`;

      if (!projection) {
        const [result] = await MySQLAPI.pool.execute(sql);
        return result;
      }

      if (projection.startsWith("-")) {
        const [result] = await MySQLAPI.pool.execute(sql);
        const query = projection.replace("-", "");
        for (let i = 0; i < result.length; i++) {
          delete result[i][`${query}`];
        }
        return result;
      }

      if (projection === "desc") {
        sql = sql.concat(" ", " ORDER BY created_at DESC");
        const [result] = await MySQLAPI.pool.execute(sql);
        return result;
      }
    }

    let sql = `SELECT *, ${asCreatedAt} FROM ${table} WHERE`;
    const values = Object.values(filter);
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      if (keys[i] === "created_at") {
        sql = sql.concat(" ", `DATE(${keys[i]})`, ` BETWEEN ? AND ?`);
        const { years, months, dates } = util.getDateTime();
        const today = `${years}-${months}-${dates}`;
        values.push(today);
        break;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }

    if (!projection) {
      const [result] = await MySQLAPI.pool.execute(sql, values);
      return result;
    }

    if (projection === "desc") {
      sql = sql.concat(" ", "ORDER BY created_at DESC");
      const [result] = await MySQLAPI.pool.execute(sql, values);
      return result;
    }
  }

  /**
   *
   * @param {string} id
   * @param {string} projection
   */
  static async selectById(id, projection) {
    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const table = this.getTable();

    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    const [[result]] = await MySQLAPI.pool.execute(sql, [id]);

    if (!projection) {
      return result;
    }

    if (projection.startsWith("-")) {
      const query = projection.replace("-", "");
      delete result[`${query}`];
      return result;
    }
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
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
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
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
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

    // 1.30 delete
    // const result = await this.selectById(id);
    // if (!result) {
    //   throw new CustomError.NotFoundError(`${table} not found`);
    // }

    let sql = `UPDATE ${table} SET`;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(" ", keys[i], " = ?,");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ? WHERE").concat(" ", "id = ?");
    }

    const values = [...Object.values(filter), id];
    await MySQLAPI.pool.execute(sql, values);

    if (!options) {
      return;
    }

    for (const [key, value] of Object.entries(options)) {
      if (key === "new" && value) {
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

    // 1.30 delete
    // const result = await this.selectById(id);
    // if (!result) {
    //   throw new CustomError.NotFoundError(`${table} not found`);
    // }

    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await MySQLAPI.pool.execute(sql, [id]);
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
export class RemnantDetail extends MySQLAPI {}
export class RemnantZone extends MySQLAPI {}
