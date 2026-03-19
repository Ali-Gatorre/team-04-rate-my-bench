const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.API3_DB_HOST || "localhost",
  user: process.env.API3_DB_USER || "userapi",
  password: process.env.API3_DB_PASSWORD || "userpass",
  database: process.env.API3_DB_NAME || "userdb",
  port: process.env.API3_DB_PORT || 5432,
});

module.exports = pool;
