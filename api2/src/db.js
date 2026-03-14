const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "discussionuser",
  password: "discussionpass",
  database: "discussiondb",
  port: 5432,
});

module.exports = pool;
