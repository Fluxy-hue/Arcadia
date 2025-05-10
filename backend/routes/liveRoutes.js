const express = require('express');
const router = express.Router();
const db = require('../db');

// GET live data
router.get('/', async (req, res) => {
  try {
    const liveUsersResult = await db.execute(
      `SELECT name FROM LIVE_USERS WHERE is_live = 1`
    );
    const lastSessionResult = await db.execute(
      `SELECT * FROM LIVE_USERS WHERE is_live = 0 ORDER BY ended_at DESC FETCH FIRST 1 ROWS ONLY`
    );
    const previousResult = await db.execute(
      `SELECT name, started_at, ended_at FROM LIVE_USERS WHERE is_live = 0 ORDER BY ended_at DESC FETCH FIRST 10 ROWS ONLY`
    );

    const liveUsers = liveUsersResult.rows || [];
    const lastSession = lastSessionResult.rows?.[0] || null;
    const previousSessions = previousResult.rows || [];

    res.json({
      live: liveUsers.map(row => row[0]), // only return names
      lastSession,
      previous: previousSessions
    });
  } catch (err) {
    console.error('Error fetching live data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST start live session
router.post('/start', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  try {
    console.log('Checking if already live for:', name);
    const check = await db.execute(
      `SELECT COUNT(*) FROM LIVE_USERS WHERE name = :name AND is_live = 1`,
      [name]
    );
    const isAlreadyLive = check.rows?.[0]?.[0] > 0;
    console.log('Already live:', isAlreadyLive);

    if (isAlreadyLive) {
      return res.status(400).json({ error: 'User is already live' });
    }

    console.log('Inserting new session...');
    const result = await db.execute(
      `INSERT INTO LIVE_USERS (name, is_live, started_at) VALUES (:name, 1, CURRENT_TIMESTAMP)`,
      [name],
      { autoCommit: true }
    );
    console.log('Insert result:', result);

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to start live session:', err); // This is the most important
    res.status(500).json({ error: 'Failed to go live' });
  }
});

// POST end live session
router.post('/end', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  try {
    const result = await db.execute(
      `UPDATE LIVE_USERS SET is_live = 0, ended_at = CURRENT_TIMESTAMP 
       WHERE name = :name AND is_live = 1`,
      [name],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'No active session found for this user' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to end live session:', err);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

module.exports = router;
