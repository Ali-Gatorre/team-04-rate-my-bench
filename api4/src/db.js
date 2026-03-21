const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.API4_DB_HOST || "localhost",
  user: process.env.API4_DB_USER || "messageapi",
  password: process.env.API4_DB_PASSWORD || "messagepass",
  database: process.env.API4_DB_NAME || "messagedb",
  port: process.env.API4_DB_PORT || 5432,
});

module.exports = pool;
