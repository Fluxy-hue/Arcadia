const express = require('express');
const cors = require('cors');
const threadRoutes = require('./routes/threadRoutes');
const liveRoutes = require('./routes/liveRoutes'); 

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/threads', threadRoutes);
app.use('/api/live', liveRoutes); 

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
