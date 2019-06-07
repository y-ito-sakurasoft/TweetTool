var fs = require("fs");
var server = require("http").createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync(__dirname + '/index.html', "utf-8");
    res.end(output);
}).listen(3000);