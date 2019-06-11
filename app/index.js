var fs = require("fs");
var server = require("http").createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync(__dirname + '/index.html', "utf-8");
    res.end(output);
}).listen(3000);

var io = require("socket.io").listen(server);

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'tweet_db',
});

var redis = require('redis');
var redisClient = redis.createClient({
    port: 6379,
    host: 'redis',
});

const TIMEOUT = 60 * 60;

io.sockets.on("connection", function (socket) {

    socket.on("connected", function () { 
        conn.query('SELECT * FROM tweets', (err, res, fields) => {
            if (err) {
                console.log(err);
            } else {
                io.to(socket.id).emit("connected", res);
            }
        });
        redisClient.setex(socket.id, TIMEOUT, socket.id);
        redisClient.get(socket.id, (err, rep) => {
            if (err) {
                console.log(err);
            } else {
                console.log("connected: " + rep);
            }
        });
    });

    socket.on("publish", function (data) {
        redisClient.get(socket.id, (err, rep) => {
            if (rep == undefined) {
                io.to(socket.id).emit("timeout");
            } else {
                conn.query('INSERT INTO tweets(name, text, date) VALUES(?, ?, ?)', [data.name, data.text, data.date], (err, res, fields) => {
                    console.log('insert msg: ' + data.text);
                });
                io.sockets.emit("publish", data);
            }
        });
    });

    socket.on("disconnect", function () { 
        redisClient.del(socket.id, (err, rep) => {
            if (err) {
                console.log(err);
            } else {
                console.log("disconnect: " + socket.id);
            }
        });
    });
});