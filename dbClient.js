const mysql = require('mysql2/promise');

class DBClient {
  constructor(config) {
    this.config = config;
  }

  async executeQuery(query, params = []) {
    const connection = await mysql.createConnection(this.config);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    return rows;
  }

  async callSP(spName, params = []) {
    const connection = await mysql.createConnection(this.config);
    // Construye la llamada al SP con los placeholders correctos
    const placeholders = params.map(() => '?').join(',');
    const [rows] = await connection.query(`CALL ${spName}(${placeholders})`, params);
    await connection.end();
    return rows;
  }
}

module.exports = DBClient;
