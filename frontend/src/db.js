// import { readdirSync, renameSync } from "fs";
// import crypto from "crypto";
// import mysql from "mysql2/promise";
// import { BadRequestError } from "./error-api";

// class MySQLClient {
//   static pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10,
//     idleTimeout: 60000,
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0,
//   });

//   async connect() {
//     (await MySQLClient.pool.getConnection()).release();
//     console.log(`Connected to DB`);
//     await this.#isExistsFile(this.#readLocalStorage());
//     // await this.#readTables();
//     //     for (const table of MySQLClient.tables) {
//     //       const writeStream = createWriteStream(`model/${table}.js`);
//     //       writeStream.write(
//     //         `import ${MySQLClient.name} from '../backend/db.js';\n\n`
//     //       );
//     //       writeStream.write(`class ${table.replace(/\w/, (char) =>
//     //         char.toUpperCase()
//     //       )} extends ${MySQLClient.name} {
//     // static async create(data) {
//     //   const sql = 'INSERT INTO ${table}(${MySQLClient.columns[table][0].Field}, ${
//     //         MySQLClient.columns[table][1].Field
//     //       }, ${MySQLClient.columns[table][2].Field}) VALUES(?, ?, ?)';
//     //   const values = Object.values(data);
//     //   await ${MySQLClient.name}.pool.execute(sql, values);
//     // }

//     // static async select(query) {
//     // if (!query) return;
//     // const keys = Object.keys(query);
//     // if (!keys.length) {
//     //   const sql = 'SELECT * FROM ${table}';
//     //   const [result] = await ${MySQLClient.name}.pool.execute(sql);
//     //   return result;
//     // }

//     // let sql = 'SELECT * FROM ${table} WHERE';
//     // const keysLength = keys.length - 1;
//     // for (let i = 0; i < keys.length; i++) {
//     //   if (i !== keysLength) {
//     //     sql = sql.concat(" ", keys[i], " = ? AND");
//     //     continue;
//     //   }
//     //   sql = sql.concat(" ", keys[i], " = ?");
//     // }
//     // const values = Object.values(query);
//     // const [result] = await ${MySQLClient.name}.pool.execute(sql, values);
//     // return result;
//     // }

//     // static async selectById(id) {
//     // const sql = 'SELECT ${table}.${MySQLClient.columns[table][0].Field}, ${table}.${
//     //         MySQLClient.columns[table][1].Field
//     //       }, ${MySQLClient.tables[0]}.${
//     //         MySQLClient.columns[table][1].Field
//     //       } AS poster FROM ${table} JOIN ${MySQLClient.tables[0]} ON ${table}.${
//     //         MySQLClient.columns[table][0].Field
//     //       } = ${MySQLClient.tables[0]}.${
//     //         MySQLClient.columns[table][0].Field
//     //       } WHERE ${table}.${MySQLClient.columns[table][0].Field} = ?';
//     // const values = [id];
//     // const [[result]] = await ${MySQLClient.name}.pool.execute(sql, values);
//     // return result;
//     // }

//     // static async selectOne(query) {
//     //   if(!query) return;
//     //   const keys = Object.keys(query);
//     //   if(!keys.length) return;

//     //   let sql = 'SELECT * FROM ${table} WHERE';
//     //   const keysLength = keys.length - 1;
//     //   for (let i = 0; i < keys.length; i++) {
//     //     if (i !== keysLength) {
//     //       sql = sql.concat(" ", keys[i], " = ? AND");
//     //       continue;
//     //     }
//     //     sql = sql.concat(" ", keys[i], " = ?");
//     //   }
//     //   const values = Object.values(query);
//     //   const [[result]] = await ${MySQLClient.name}.pool.execute(sql, values);
//     //   return result;
//     //   }
//     // }

//     // export default ${table.replace(/\w/, (char) => char.toUpperCase())}
//     // `);
//     //       writeStream.end();
//     //     }
//     //     return;
//     //     for (let i = 0; i < MySQLClient.tables.length; i++) {
//     //       writeFileSync(
//     //         `test/${MySQLClient.tables[i]}.js`,
//     //         `import ${MySQLClient.name} from '../backend/db.js';

//     // class ${MySQLClient.tables[i].replace(/\w/, (char) =>
//     //           char.toUpperCase()
//     //         )} extends ${MySQLClient.name} {
//     //   static async select(query) {
//     //     if (!query) return;
//     //     const keys = Object.keys(query);
//     //     if (!keys.length) {
//     //       const sql = 'SELECT * FROM ${MySQLClient.tables[i]}';
//     //       const [result] = await ${MySQLClient.name}.pool.execute(sql);
//     //       return result;
//     //     }

//     //     let sql = 'SELECT * FROM ${MySQLClient.tables[i]} WHERE';
//     //     const keysLength = keys.length - 1;
//     //     for (let i = 0; i < keys.length; i++) {
//     //       if (i !== keysLength) {
//     //         sql = sql.concat(" ", keys[i], " = ? AND");
//     //         continue;
//     //       }
//     //       sql = sql.concat(" ", keys[i], " = ?");
//     //     }
//     //     const values = Object.values(query);
//     //     const [result] = await ${MySQLClient.name}.pool.execute(sql, values);
//     //     return result;
//     //   }

//     //   static async selectById(id) {
//     //     const sql = 'SELECT ${MySQLClient.tables[1]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][0].Field
//     //         }, ${MySQLClient.tables[1]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][1].Field
//     //         }, ${MySQLClient.tables[0]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][1].Field
//     //         } AS poster FROM ${MySQLClient.tables[1]} JOIN ${
//     //           MySQLClient.tables[0]
//     //         } ON ${MySQLClient.tables[1]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][0].Field
//     //         } = ${MySQLClient.tables[0]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][0].Field
//     //         } WHERE ${MySQLClient.tables[1]}.${
//     //           MySQLClient.columns[MySQLClient.tables[i]][0].Field
//     //         } = ?';
//     //     const values = [id];
//     //     const [[result]] = await ${MySQLClient.name}.pool.execute(sql, values);
//     //     return result;
//     //   }
//     // }
//     // export default ${MySQLClient.tables[i].replace(/\w/, (char) =>
//     //           char.toUpperCase()
//     //         )}
//     // `
//     //       );
//     //     }
//   }

//   async #createImage(file, hex) {
//     try {
//       const url = "static/images";
//       const path = `/${url}/${hex}.png`;
//       const values = [hex, path];
//       const sql = `INSERT INTO image(id, path) VALUES(?, ?)`;
//       await MySQLClient.pool.execute(sql, values);
//       renameSync(`${url}/${file}.png`, `${url}/${hex}.png`);
//     } catch (error) {
//       console.log(error);
//       return;
//     }
//   }

//   async #createVideo(file, hex) {
//     try {
//       const url = "static/videos";
//       const path = `/${url}/${hex}.mov`;
//       const values = [hex, path];
//       const sql = `INSERT INTO video(id, path) VALUES(?, ?)`;
//       await MySQLClient.pool.execute(sql, values);
//       renameSync(`${url}/${file}.mov`, `${url}/${hex}.mov`);
//     } catch (error) {
//       console.log(error);
//       return;
//     }
//   }

//   async #isExistsFile(files) {
//     for (const file of files) {
//       let video;
//       try {
//         const sql = "SELECT id FROM video WHERE id = ?";
//         [[video]] = await MySQLClient.pool.execute(sql, [file]);
//       } catch (error) {
//         console.log(error);
//         return;
//       }
//       if (video) continue;
//       const hex = crypto.randomBytes(16).toString("hex");
//       await this.#createVideo(file, hex);
//       await this.#createImage(file, hex);
//     }
//   }

//   #readLocalStorage() {
//     const files = readdirSync("static/videos")
//       .filter((file) => {
//         if (!file.includes(".DS_Store")) return file;
//       })
//       .map((file) => file.split(".")[0]);
//     return files;
//   }

//   async #readTables() {
//     const sql = "SHOW TABLES";
//     const [results] = await MySQLClient.pool.execute(sql);
//     for (const result of results) {
//       MySQLClient.tables.push(result.Tables_in_test);
//     }
//     for (const table of MySQLClient.tables) {
//       const sql = `DESC ${table}`;
//       const [result] = await MySQLClient.pool.execute(sql);
//       MySQLClient.columns[table] = result;
//     }
//   }

//   static async create(query) {
//     if (!query) {
//       throw new BadRequestError("Provide query");
//     }

//     const keys = Object.keys(query);
//     let sql = `INSERT INTO ${this.name.toLowerCase()}(`;
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat(keys[i], ", ");
//         continue;
//       }
//       sql = sql.concat(keys[i], ") VALUES(");
//     }
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat("?, ");
//         continue;
//       }
//       sql = sql.concat("?)");
//     }
//     const values = Object.values(query);
//     await MySQLClient.pool.execute(sql, values);
//   }

//   static async select(query) {
//     if (!query) {
//       throw new BadRequestError("Provide query");
//     }

//     const keys = Object.keys(query);
//     if (!keys.length) {
//       const sql = `SELECT * FROM ${this.name.toLowerCase()}`;
//       const [result] = await MySQLClient.pool.execute(sql);
//       return result;
//     }

//     let sql = `SELECT * FROM ${this.name.toLowerCase()} WHERE`;
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat(" ", keys[i], " = ? AND");
//         continue;
//       }
//       sql = sql.concat(" ", keys[i], " = ?");
//     }
//     const values = Object.values(query);
//     const [result] = await MySQLClient.pool.execute(sql, values);
//     return result;
//   }

//   static async selectById(id) {
//     if (!id) {
//       throw new BadRequestError("Provide id");
//     }

//     const table = this.name.toLowerCase();
//     const sql = `SELECT * FROM ${table} WHERE ${table}.id = ?`;
//     const values = [id];
//     const [[result]] = await MySQLClient.pool.execute(sql, values);
//     return result;
//   }

//   static async selectJoinById(id, query, projection) {
//     if (!id) {
//       throw new BadRequestError("Provide id");
//     }

//     const table = this.name.toLowerCase();
//     const sql = `
//     SELECT ${table}.id, ${table}.path, image.path AS poster
//     FROM ${table} JOIN image
//     ON ${table}.id = image.id
//     WHERE ${table}.id = ?
//     `;
//     const values = [id];
//     const [[result]] = await MySQLClient.pool.execute(sql, values);
//     return result;
//   }

//   static async selectOne(query) {
//     if (!query) {
//       throw new BadRequestError("Provide query");
//     }

//     const keys = Object.keys(query);
//     if (!keys.length) {
//       throw new BadRequestError("Provide key");
//     }

//     let sql = `SELECT * FROM ${this.name.toLowerCase()} WHERE`;
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat(" ", keys[i], " = ? AND");
//         continue;
//       }
//       sql = sql.concat(" ", keys[i], " = ?");
//     }
//     const values = Object.values(query);
//     const [[result]] = await MySQLClient.pool.execute(sql, values);
//     return result;
//   }

//   static async update(query, projection) {
//     if (!query) {
//       throw new BadRequestError("Provide query");
//     }

//     const keys = Object.keys(query);
//     if (!keys.length) {
//       throw new BadRequestError("Provide key");
//     }

//     let sql = `UPDATE ${this.name.toLowerCase()} SET`;
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat(" ", keys[i], " = ?,");
//         continue;
//       }
//       sql = sql.concat(" ", keys[i], " = ? WHERE").concat(" ", keys[i], " = ?");
//     }

//     let values = Object.values(query);
//     if (projection) {
//       const keys = Object.keys(projection);
//       for (let i = 0; i < keys.length; i++) {
//         sql = sql.concat(" AND", keys[i], " = ?");
//       }
//       values = values.concat(Object.values(projection));
//     }
//     const [[result]] = await MySQLClient.pool.execute(sql, values);
//     return result;
//   }

//   static async delete(query) {
//     if (!query) {
//       throw new BadRequestError("Provide query");
//     }

//     const keys = Object.keys(query);
//     if (!keys.length) {
//       throw new BadRequestError("Provide key");
//     }

//     let sql = `DELETE FROM ${this.name.toLowerCase()} WHERE`;
//     for (let i = 0; i < keys.length; i++) {
//       if (i !== keys.length - 1) {
//         sql = sql.concat(" ", keys[i], " = ? AND");
//         continue;
//       }
//       sql = sql.concat(" ", keys[i], " = ?");
//     }
//     const values = Object.values(query);
//     await MySQLClient.pool.execute(sql, values);
//   }
// }

// class Video extends MySQLClient {}

// class Image extends MySQLClient {}

// class User extends MySQLClient {}

// class Token extends MySQLClient {}

// const mysqlClient = new MySQLClient();
// export default mysqlClient;
// export { Image, Video, User, Token };
