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

  async connect() {
    (await MySQLAPI.pool.getConnection()).release();
    console.log(`Connected to DB`);
  }

  /**
   *
   * @param {{}} filter
   */
  static async create(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const keys = Object.keys(filter);
    let sql = `INSERT INTO ${this.name.toLowerCase()}(`;
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

    const keys = Object.keys(filter);
    if (!keys.length) {
      const sql = `
      SELECT *, ${createdAt} FROM ${this.name.toLowerCase()}
      `;

      const [result] = await MySQLAPI.pool.execute(sql);
      return result;
    }

    let sql = `SELECT *, ${createdAt} FROM ${this.name.toLowerCase()} WHERE`;
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

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const table = this.name.toLowerCase();
    const sql = `SELECT *, ${createdAt} FROM ${table} WHERE ${table}.id = ?`;
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

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `SELECT *, ${createdAt} FROM ${this.name.toLowerCase()} WHERE`;
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
   * @param {{}} projection
   */
  static async update(filter, projection) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `UPDATE ${this.name.toLowerCase()} SET`;
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (i !== len - 1) {
        sql = sql.concat(" ", keys[i], " = ?,");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ? WHERE").concat(" ", keys[i], " = ?");
    }

    let values = Object.values(filter);
    if (projection) {
      const keys = Object.keys(projection);
      for (let i = 0, len = keys.length; i < len; ++i) {
        sql = sql.concat(" AND", keys[i], " = ?");
      }
      values = values.concat(Object.values(projection));
    }
    await MySQLAPI.pool.execute(sql, values);
  }

  /**
   *
   * @param {{}} filter
   */
  static async delete(filter) {
    if (!filter) {
      throw new CustomError.BadRequestError("Provide filter");
    }

    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `DELETE FROM ${this.name.toLowerCase()} WHERE`;
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
}

class Video extends MySQLAPI {}

class Image extends MySQLAPI {}

class User extends MySQLAPI {}

class Token extends MySQLAPI {}

const mysqlAPI = new MySQLAPI();
export default mysqlAPI;
export { Image, Video, User, Token };
