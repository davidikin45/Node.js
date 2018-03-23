'use strict';
var http = require('http');
var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var app = express();
var controllers = require('./controllers');
var flash = require('connect-flash');

//1. Setup the View Engine
//app.set("view engine", "jade");
app.set("view engine", "vash"); //razor

//2. Opt into middleware services
//posting form data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//posting json datas
//temporary error data in session state
app.use(cookieParser());
app.use(session({
    secret: "abcdef",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//3. set the public static resource folder
app.use(express.static(__dirname + "/public"));

//4. Use authentication
var auth = require("./auth");
auth.init(app);

//5. Map the routes
controllers.init(app);

//6. SQL DB Connection config
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config =
    {
        userName: "test",
        password: "password12",
        server: 'localhost', // update me
        options:
        {
            database: 'DND', //update me
            port: 1434,
            rowCollectionOnRequestCompletion : true
            , encrypt: true
        }
    };

app.get("/api/users", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.send({ name:"Shawn", isValid: true, group: "Admin"});
});

app.get("/api/sql", function (req, res) {
    // Create connection to database
    var sqlConnection = new Connection(config);
    sqlConnection.on('connect', function (err) {
        // If no error, then good to go...
        if (err) {
            console.log(err);
        } else {
            var request = new Request("SELECT * FROM BlogPost", function (err, rowCount, rows) {
                var rowarray = [];
                rows.forEach(function (columns) {
                    var rowdata = new Object();
                    columns.forEach(function (column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                sqlConnection.close();
                res.send(rowarray);
            });
            sqlConnection.execSql(request);
        }       
    }
    );
});

var server = http.createServer(app);
var port = process.env.PORT || 1337;
server.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});

//7. Enable Web Sockets
var webSocket = require("./web-socket");
webSocket.init(server);