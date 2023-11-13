import { readdirSync, renameSync, writeFileSync } from "fs";
const { randomFillSync } = require("crypto");
import mysql from "mysql2/promise";

class MySQLClient {
  static pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    connectionLimit: 1,
  });
  static tables = [];
  static columns = {};

  async connect() {
    (await MySQLClient.pool.getConnection()).release();
    console.log(`Connected to DB`);
    await this.#readTables();
    await this.#isExistsFile(this.#readLocalStorage());
    for (let i = 0; i < MySQLClient.tables.length; i++) {
      writeFileSync(
        `test/${MySQLClient.tables[i]}.js`,
        `import ${MySQLClient.name} from '../backend/db.js';

class ${MySQLClient.tables[i].replace(/\w/, (char) =>
          char.toUpperCase()
        )} extends ${MySQLClient.name} {
  static async select(query) {
    if (!query) return;
    const keys = Object.keys(query);
    if (!keys.length) {
      const sql = 'SELECT * FROM ${MySQLClient.tables[i]}';
      const [result] = await ${MySQLClient.name}.pool.execute(sql);
      return result;
    }

    let sql = 'SELECT * FROM ${MySQLClient.tables[i]} WHERE';
    const keysLength = keys.length - 1;
    for (let i = 0; i < keys.length; i++) {
      if (i !== keysLength) {
        sql = sql.concat(" ", keys[i], " = ? AND");
        continue;
      }
      sql = sql.concat(" ", keys[i], " = ?");
    }
    const values = Object.values(query);
    const [result] = await ${MySQLClient.name}.pool.execute(sql, values);
    return result;
  }

  static async selectById(id) {
    const sql = 'SELECT ${MySQLClient.tables[1]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][0].Field
        }, ${MySQLClient.tables[1]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][1].Field
        }, ${MySQLClient.tables[0]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][1].Field
        } AS poster FROM ${MySQLClient.tables[1]} JOIN ${
          MySQLClient.tables[0]
        } ON ${MySQLClient.tables[1]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][0].Field
        } = ${MySQLClient.tables[0]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][0].Field
        } WHERE ${MySQLClient.tables[1]}.${
          MySQLClient.columns[Symbol.for(MySQLClient.tables[i])][0].Field
        } = ?';
    const values = [id];
    const [[result]] = await ${MySQLClient.name}.pool.execute(sql, values);
    return result;
  }
}
export default ${MySQLClient.tables[i].replace(/\w/, (char) =>
          char.toUpperCase()
        )}
`
      );
    }
  }

  async #createImage(file, hex) {
    try {
      const url = "static/images";
      const path = `/${url}/${hex}.png`;
      const values = [hex, path];
      const sql = `INSERT INTO image(id, path) VALUES(?, ?)`;
      await MySQLClient.pool.execute(sql, values);
      renameSync(`${url}/${file}.png`, `${url}/${hex}.png`);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async #createVideo(file, hex) {
    try {
      const url = "static/videos";
      const path = `/${url}/${hex}.mov`;
      const values = [hex, path];
      const sql = `INSERT INTO video(id, path) VALUES(?, ?)`;
      await MySQLClient.pool.execute(sql, values);
      renameSync(`${url}/${file}.mov`, `${url}/${hex}.mov`);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async #isExistsFile(files) {
    for (const file of files) {
      let video;
      try {
        const sql = `SELECT id FROM video WHERE id = ?`;
        [[video]] = await MySQLClient.pool.execute(sql, [file]);
      } catch (error) {
        console.log(error);
        return;
      }
      if (video) continue;
      const hex = randomFillSync(Buffer.alloc(16)).toString("hex");
      await this.#createVideo(file, hex);
      await this.#createImage(file, hex);
    }
  }

  #readLocalStorage() {
    const files = readdirSync("static/videos")
      .filter((file) => {
        if (!file.includes(".DS_Store")) return file;
      })
      .map((file) => file.split(".")[0]);
    return files;
  }

  async #readTables() {
    const sql = "SHOW TABLES";
    const [results] = await MySQLClient.pool.execute(sql);
    for (const result of results) {
      MySQLClient.tables.push(result.Tables_in_test);
    }
    for (const table of MySQLClient.tables) {
      const sql = `DESC ${table}`;
      const [result] = await MySQLClient.pool.execute(sql);
      MySQLClient.columns[Symbol.for(table)] = result;
    }
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
  static insert() {}

  static async select(query) {
    const table = this.name.toLowerCase();

    if (!query) return;
    const keys = Object.keys(query);
    if (!keys.length) {
      const sql = `SELECT * FROM ${table}`;
      const [result] = await MySQLClient.pool.execute(sql);
      return result;
    }

    let sql = `SELECT * FROM ${table} WHERE`;
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
    const sql = `
    SELECT video.id, video.path, image.path AS poster
    FROM video
    JOIN image ON video.id = image.id
    WHERE video.id = ?
    `;
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
    const table = this.name.toLowerCase();
    const columns = MySQLClient.columns[Symbol.for(table)];

    if (!query) return;
    const keys = Object.keys(query);
    if (!keys.length) {
      const sql = `SELECT id, path FROM ${table}`;
      const [result] = await MySQLClient.pool.execute(sql);
      return result;
    }
    let sql = `SELECT id, path FROM ${table} WHERE`;
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
export default MySQLClient;
export { mysqlClient };
