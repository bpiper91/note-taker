// load express
const express = require('express');

// set port
const PORT = process.env.PORT || 3001;

// set express instance to variable
const app = express();

// load routes
const apiRoutes = require('./routes/apiRoutes.js');
const htmlRoutes = require('./routes/htmlRoutes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// indicate which route to use on URLs
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});