const http = require('http');
const express = require('express');
const layout = require('ejs-mate')
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const clientPath = `${__dirname}/../client`;



const app = express();

app.engine('ejs', layout);
app.set('views', `${clientPath}/src/views`);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret123'));
app.use(express.static(clientPath));

const server = http.createServer(app);

app.get('/node-app/oldHome', function(req, res){
    res.redirect('/node-app/home');
});

app.get('/node-app/home', function(req, res){

    let optionsSigned = {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: true
    }

    let optionsUnsigned = {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: false
    }

    let now = new Date();
    let signedCookieVal = `signedCookieValue_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
    let unsignedCookieVal = `unsignedCookieValue_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

    res.cookie('signedCookie', signedCookieVal, optionsSigned);
    res.cookie('unsignedCookie', unsignedCookieVal, optionsUnsigned);

    res.render('home',  { 
      hidden1: getRandomNumber(1), 
      hidden2: getRandomNumber(2) }
    );
});

app.post('/node-app/login', function(req, res){
  console.log(req.body)
  console.log(req.signedCookies) 
  console.log(req.cookies) 

  res.render('profile', { 
    username: req.body.username, 
    password: req.body.password,
    hiddenValue1: req.body.hidden1,
    hiddenValue2: req.body.hidden2,
    signedCookies: JSON.stringify(req.signedCookies),
    unsignedCookies: JSON.stringify(req.cookies)
  });

});

app.post('/node-app/login-r', (req, res) => {
  res.redirect(307, '/node-app/login');
});

app.get('/node-app/get', function(req, res){
    res.send('This is a simple get request!');
});

app.post('/node-app/post', function(req, res){
    res.send('This is a simple post request!');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Server started on port 8080 - http://127.0.0.1:8080');
  console.log(`Serving static from ${clientPath}`);
});

const getRandomNumber = (index) => {
  let max = 999999;
  let min = 1;
  let rng = `${index}_${Math.floor((Math.random() * (max - min)) + min)}`; 
  return rng;
}


// curl 
// curl -X POST ..
// res.sendFile(path.resolve(`${clientPath}/src/views/home.ejs`));
// curl -X POST -d "username=gku&password=slaptazodis&hidden1=11111&hidden2=999999" http://localhost:8080/node-app/login
