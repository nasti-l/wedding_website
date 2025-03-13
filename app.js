const express = require('express');
const bodyParser = require('body-parser');
const guestRoutes = require('./routes/guestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

const app = express();
app.use(express.static('./'));

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Serve the admin page (via route)
app.use('/admin', adminRoutes);

// API routes
app.use('/api/guests', guestRoutes);

// Redirect `/` to `/admin`
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Start the server on a random port
const server = app.listen(0, () => {
  const port = server.address().port; // Retrieve the randomly assigned port
  console.log(`Server is running on http://localhost:${port} (random port)`);
});

// Graceful server shutdown
const gracefulShutdown = () => {
  console.log('Shutting down server gracefully...');

  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0); // Exit the process
  });

  // Force shutdown if any lingering connections remain
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 5000); // 5 seconds timeout
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown); // Handle Ctrl+C
process.on('SIGTERM', gracefulShutdown); // Handle kill process

module.exports = { server, app };
