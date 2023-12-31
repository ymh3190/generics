import mysql from "mysql2/promise";
import * as CustomError from "./error";

class MySQLClient {
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
    (await MySQLClient.pool.getConnection()).release();
    console.log(`Connected to DB`);
  }

  static async create(query) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
    let sql = `INSERT INTO ${this.name.toLowerCase()}(`;
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
    const values = Object.values(query);
    await MySQLClient.pool.execute(sql, values);
  }

  static async select(query) {
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
      const [result] = await MySQLClient.pool.execute(sql);
      return result;
    }

    let sql = `SELECT *, ${createdAt} FROM ${this.name.toLowerCase()} WHERE`;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
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
    if (!id) {
      throw new CustomError.BadRequestError("Provide id");
    }

    const createdAt = `
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%m:%s') AS created_at
    `;

    const table = this.name.toLowerCase();
    const sql = `SELECT *, ${createdAt} FROM ${table} WHERE ${table}.id = ?`;
    const values = [id];
    const [[result]] = await MySQLClient.pool.execute(sql, values);
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
    const [[result]] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

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
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(query);
    const [[result]] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

  static async update(query, projection) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `UPDATE ${this.name.toLowerCase()} SET`;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(" ", keys[i], " = ?,");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ? WHERE").concat(" ", keys[i], " = ?");
    }

    let values = Object.values(query);
    if (projection) {
      const keys = Object.keys(projection);
      for (let i = 0; i < keys.length; i++) {
        sql = sql.concat(" AND", keys[i], " = ?");
      }
      values = values.concat(Object.values(projection));
    }
    const [[result]] = await MySQLClient.pool.execute(sql, values);
    return result;
  }

  static async delete(query) {
    if (!query) {
      throw new CustomError.BadRequestError("Provide query");
    }

    const keys = Object.keys(query);
    if (!keys.length) {
      throw new CustomError.BadRequestError("Provide key");
    }

    let sql = `DELETE FROM ${this.name.toLowerCase()} WHERE`;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keys.length - 1) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(query);
    await MySQLClient.pool.execute(sql, values);
  }
}

class Video extends MySQLClient {}

class Image extends MySQLClient {}

class User extends MySQLClient {}

class Token extends MySQLClient {}

const mysqlClient = new MySQLClient();
export default mysqlClient;
export { Image, Video, User, Token };
