const oracledb = require('oracledb');

// Initialize Oracle Instant Client
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_8' });

// Default output format can still be array for general use
oracledb.outFormat = oracledb.OUT_FORMAT_ARRAY;

// DB credentials
const dbConfig = {
  user: 'live_user',
  password: 'live123',
  connectString: 'localhost/XEPDB1',
};

let pool;

// Initialize connection pool
async function init() {
  if (!pool) {
    pool = await oracledb.createPool(dbConfig);
    console.log('Oracle connection pool started');
  }
}

// Get a connection from the pool
async function getConnection() {
  await init();
  return await pool.getConnection();
}

// Execute a query using auto-managed connection (no LOB streaming)
async function execute(query, params = [], options = {}) {
  let connection;
  try {
    console.log('Running query:', query);
    console.log('With params:', params);

    connection = await getConnection();
    const result = await connection.execute(query, params, options);
    return result;
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

module.exports = {
  init,
  getConnection,
  execute
};
