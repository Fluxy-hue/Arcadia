const express = require('express');
const router = express.Router();
const db = require('../db');
const oracledb = require('oracledb');

// Helper to convert CLOB to string
const clobToString = (lob) => {
  return new Promise((resolve, reject) => {
    if (typeof lob === 'string') return resolve(lob);
    if (!lob) return resolve('');

    let data = '';
    lob.setEncoding('utf8');
    lob.on('data', chunk => data += chunk);
    lob.on('end', () => resolve(data));
    lob.on('error', err => reject(err));
  });
};

// POST a thread (with manual connection for LOB)
router.post('/', async (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'Missing name or content' });

  let connection;

  try {
    connection = await db.getConnection();

    await connection.execute(
      `INSERT INTO threads (name, content, timestamp) VALUES (:name, :content, SYSTIMESTAMP)`,
      { name, content },
      { autoCommit: true }
    );

    res.sendStatus(201);
  } catch (err) {
    console.error('POST /threads error:', err);
    res.status(500).json({ error: 'DB insert failed' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing DB connection:', err);
      }
    }
  }
});

// GET all threads (CLOB-safe)
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT name, content, timestamp FROM threads ORDER BY timestamp DESC`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        resultSet: true
      }
    );

    const rs = result.resultSet;
    const threads = [];
    let row;

    while ((row = await rs.getRow())) {
      const content = await clobToString(row.CONTENT);
      threads.push({
        name: row.NAME,
        content,
        timestamp: row.TIMESTAMP
      });
    }

    await rs.close();
    res.json(threads);

  } catch (err) {
    console.error('Thread fetch error:', err);
    res.status(500).json({ error: 'DB fetch failed' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Failed to close DB connection:', closeErr);
      }
    }
  }
});

module.exports = router;

