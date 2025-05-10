// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const liveUsers = new Map(); // { userId: { name, lastLiveTime } }

// Start a live session
router.post('/go-live', (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) return res.status(400).json({ message: 'userId and name required' });

  liveUsers.set(userId, {
    name,
    lastLiveTime: new Date().toISOString(),
  });
  res.json({ message: 'Live session started' });
});

// End a live session
router.post('/end-live', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  if (liveUsers.has(userId)) {
    const user = liveUsers.get(userId);
    user.lastLiveTime = new Date().toISOString();
    liveUsers.set(userId, user);
    liveUsers.delete(userId);
  }
  res.json({ message: 'Live session ended' });
});

// Get all currently live users
router.get('/live-users', (req, res) => {
  const users = Array.from(liveUsers.entries()).map(([id, info]) => ({
    userId: id,
    name: info.name,
  }));
  res.json(users);
});

// Get last live info for a specific user
router.get('/last-live/:userId', (req, res) => {
  const { userId } = req.params;
  const user = liveUsers.get(userId);
  if (user) {
    return res.json({ lastLiveTime: user.lastLiveTime });
  }
  res.status(404).json({ message: 'User not found' });
});

module.exports = router;
