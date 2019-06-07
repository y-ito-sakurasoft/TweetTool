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

io.sockets.on("connection", function (socket) {

    socket.on("connected", function () { 
        conn.query('SELECT * FROM tweets', (err, res, fields) => {
            if (err) {
                console.log(err);
            } else {
                io.to(socket.id).emit("connected", res);
            }
        });
    });

    socket.on("publish", function (data) {
        conn.query('INSERT INTO tweets(name, text, date) VALUES(?, ?, ?)', [data.name, data.text, data.date], (err, res, fields) => {
            console.log(res);
        });
        io.sockets.emit("publish", data);
    });

    socket.on("disconnect", function () { });
});