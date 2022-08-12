// load path for responding with HTML pages
const path = require('path');
// load express and router
const router = require('express').Router();

// send home page back on / request
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// send notes page back on /notes request
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// send home page back on any other request
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;