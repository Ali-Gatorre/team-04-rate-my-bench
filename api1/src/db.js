const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.API1_DB_HOST || "localhost",
  user: process.env.API1_DB_USER || "benchuser",
  password: process.env.API1_DB_PASSWORD || "benchpass",
  database: process.env.API1_DB_NAME || "benchdb",
  port: process.env.API1_DB_PORT || 5432,
});

module.exports = pool;
