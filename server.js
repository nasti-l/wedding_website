const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// In-memory "guest list" storage
let guestList = [];

// Serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html')); // Serve the admin page
});

// Redirect `/` to `/admin`
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// API to add a guest to the list
app.post('/api/guests', (req, res) => {
  const { name, phone } = req.body;

  // Basic validation
  if (!name || !phone) {
    return res.status(400).send({ error: 'Name and phone are required!' });
  }

  // Add the guest to the list
  const newGuest = { id: guestList.length + 1, name, phone };
  guestList.push(newGuest);

  console.log(`Guest added: ${JSON.stringify(newGuest)}`);
  res.status(201).send({ message: 'Guest added successfully', guest: newGuest });
});
// API to retrieve the current guest list (for testing purpose)
app.get('/api/guests', (req, res) => {
  res.send(guestList);
});

// API to delete a guest by ID
app.delete('/api/guests/:id', (req, res) => {
  const guestId = parseInt(req.params.id);

  // Find and remove the guest from the list
  const initialLength = guestList.length;
  guestList = guestList.filter((guest) => guest.id !== guestId);

  if (guestList.length < initialLength) {
    res.send({ message: 'Guest deleted successfully!' });
  } else {
    res.status(404).send({ error: 'Guest not found' });
  }
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
