const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);


app.get('/oldHome', function(req, res){
    res.redirect('/home');
});

app.get('/home', function(req, res){
    res.sendFile(path.resolve(`${clientPath}/src/login.html`));
});

app.get('/get', function(req, res){
    res.send('This is a simple get request!');
});

app.post('/post', function(req, res){
    res.send('This is a simple post request!');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Server started on port 8080 - http://127.0.0.1:8080');
});


// curl 
// curl -X POST ..