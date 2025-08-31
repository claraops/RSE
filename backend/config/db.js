const mysql = require("mysql2");

// ✅ Création connexion en mode Promise
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "rse_db",
});

// On exporte la version Promise
module.exports = pool.promise();




/*const mysql = require("mysql2");
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "rse_db"
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ Connexion MySQL réussie");
});




/*const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rse_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});*

module.exports = pool;*/