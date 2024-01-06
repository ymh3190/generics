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
   * @param {{}} query
   * @param {{}} options
   */
  static async create(query, options = null) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
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
    const values = Object.values(query);
    await MySQLAPI.pool.execute(sql, values);

    // TODO: options filter
    if (options) {
      const keys = Object.keys(options);
    }
  }

  /**
   *
   * @param {{}} query
   * @param {{}} filter
   * @param {{}} options
   * @returns
   */
  static async select(query, filter = null, options = null) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const keys = Object.keys(query);
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
    const values = Object.values(query);
    const [result] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {string} id
   * @returns
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

  static async selectJoinById(id, query, projection) {
    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const table = this.name.toLowerCase();
    const sql = `
    SELECT ${table}.id, ${table}.path, image.path AS poster
    FROM ${table} JOIN image
    ON ${table}.id = image.id
    WHERE ${table}.id = ?
    `;
    const values = [id];
    const [[result]] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {{}} query
   * @returns
   */
  static async selectOne(query) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const keys = Object.keys(query);
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
    const values = Object.values(query);
    const [[result]] = await MySQLAPI.pool.execute(sql, values);
    return result;
  }

  /**
   *
   * @param {{}} query
   * @param {{}} projection
   */
  static async update(query, projection = null) {
    // TODO: 매개변수 이름 및 로직 수정이 필요
    // projection? filter? condition?
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
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

    let values = Object.values(query);
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
   * @param {{}} query
   */
  static async delete(query) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
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
    const values = Object.values(query);
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
