// Configs/database.js
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import chalk from "chalk";

dotenv.config();

const DB_CREDENTIAL = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION || "mysql",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  dialectOptions: { decimalNumbers: true },
  seederStorage: "sequelize",
  seederStorageTableName: "SequelizeMetaSeeders",
};

const sequelize = new Sequelize(DB_CREDENTIAL);

try {
  await sequelize.authenticate();
  console.log(chalk.greenBright("✅ Database connection established successfully :)"));
} catch (err) {
  console.error(chalk.redBright("❌ Failed to connect to Database :("), err);
}

// For Sequelize CLI (development/test/production configs)
const dbConfig = {
  development: DB_CREDENTIAL,
  test: DB_CREDENTIAL,
  production: DB_CREDENTIAL,
};

export { DB_CREDENTIAL, sequelize, dbConfig };
export default sequelize;



// // Configs/database.js
// import dotenv from 'dotenv';
// dotenv.config();

// const config = {
//   development: {
//     username: process.env.DB_USER || 'your_username',
//     password: process.env.DB_PASSWORD || 'your_password',
//     database: process.env.DB_NAME || 'tcrm_development',
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: process.env.DB_PORT || 5432,
//     dialect: process.env.DB_DIALECT || 'postgres',
//     logging: console.log,
//     define: {
//       underscored: true,
//       freezeTableName: true,
//       timestamps: true
//     }
//   },
//   test: {
//     username: process.env.DB_USER || 'your_username',
//     password: process.env.DB_PASSWORD || 'your_password',
//     database: process.env.DB_NAME || 'tcrm_test',
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: process.env.DB_PORT || 5432,
//     dialect: process.env.DB_DIALECT || 'postgres',
//     logging: false,
//     define: {
//       underscored: true,
//       freezeTableName: true,
//       timestamps: true
//     }
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT || 'postgres',
//     logging: false,
//     define: {
//       underscored: true,
//       freezeTableName: true,
//       timestamps: true
//     },
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// };

// export default config;