
// Asenna ensin express npm install express --save
//Asenna ensin cookie parser npm install cookie-parser

// https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js
//SSL, kokeilin, mutta en sitten käytäkäään tätä: npm install uuid

var express = require('express');
var app=express();

var fs = require("fs");

let cookieParser = require('cookie-parser'); 

app.use(cookieParser()); 

var bodyParser = require('body-parser');


const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//SSL:
/*
const uuidv1 = require('uuid/v1');
uuidv1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 

const uuidv4 = require('uuid/v4');
uuidv4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
console.log("Mitähän tulee:");
console.log(uuidv4()); 
*/
//SSL toinen tapa:
const crypto = require("crypto");
//const id = crypto.randomBytes(16).toString("hex");
//console.log("Mitähän tulee cryptolla:");
//console.log(id); 



let users = {
userName : "Testi",
loginTime : Date.now(),
sessionId : 1234
}



//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
   // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   // res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Staattiset filut
//app.use(express.static('public')); //SSL: tämä siis ei toiminut(videolla info)

// REST API Asiakas

app.get('/login',(req, res) => {
    //console.log(req);//SSL
    console.log("täällä login");//
    console.log(req.body);//
    console.log(req.params);//
    console.log(req.query);//
    
    users.userName = req.query.nimi;
    users.loginTime = Date.now(),
    users.sessionId = crypto.randomBytes(16).toString("hex");

    console.log(users.sessionId);

    res.cookie("userData", users);
    //res.send("Kayttaja lisatty")  
    fs.readFile("test.htm", function(err, data){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end(); 
    });

});

app.get('/getuser',(req, res) => {
    console.log("getuser:");
    console.log(req.cookies);
    //res.send(req.cookies)
    if ((req.cookies.userData != null) && (req.cookies.userData.sessionId != null) && (req.cookies.userData.userName != null)){
        res.send(req.cookies.userData.userName)
    }
});

app.get('/logout',(req, res) => {
    res.clearCookie("userData");
    console.log("cookie poistettu");

    fs.readFile("loginPage.htm", function(err, data){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end(); 
    });

    //res.send("Kayttaja poistettu")
});

app.get('/', function(request, response){
        var pageToShow="loginpage.htm";
        
        console.log(request.cookies);//SSL
        //if (request.cookies.userData != null){
        if ((request.cookies.userData != null) && (request.cookies.userData.sessionId != null)){

            //TODO: testaa onko sama sessio
            console.log(request.cookies.userData.sessionId);
            pageToShow ="test.htm";
        }
        
        fs.readFile(pageToShow, function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();    
    });
    
    /*
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Terve maailma");
    */ 
});


app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  