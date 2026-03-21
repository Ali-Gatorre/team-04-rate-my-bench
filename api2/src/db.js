const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.API2_DB_HOST || "db2",
  user: process.env.API2_DB_USER || "discussionuser",
  password: process.env.API2_DB_PASSWORD || "discussionpass",
  database: process.env.API2_DB_NAME || "discussiondb",
  port: process.env.API2_DB_PORT || 5432,
});

module.exports = pool;
