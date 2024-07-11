import postgres from "postgres";

const sql = postgres({
  host: process.env.PIKANEXT_DB_HOST,
  port: parseInt(process.env.PIKANEXT_DB_PORT as string),
  username: process.env.PIKANEXT_DB_USER,
  password: process.env.PIKANEXT_DB_PASS,
  database: process.env.PIKANEXT_DB_NAME,
});

export { sql };
