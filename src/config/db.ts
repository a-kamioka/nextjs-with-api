import mysql from "serverless-mysql";

export const db = mysql({
  config: {
    host: "localhost",
    user: "root",
    password: "L@ndon2011",
    port: 3306,
    database: "spots",
  },
});