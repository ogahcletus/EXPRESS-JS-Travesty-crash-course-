const express = require('epress');

// init express
const app = express();

//Create your endpoints or/ route handlers
app.get('/', function(req, res) {

    res.send('Hello Kleitos!');
});

// Listen on a port

app.listen(5000);