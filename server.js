var _ = require("underscore");
var http = require("http");
var express = require("express");
var path = require("path");

var app = express();

app.use('/', express.static(path.join(__dirname, '/static')));

var port = Number(process.env.PORT || 5000);
var server = http.createServer(app);
server.listen(port);

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({server: server});

var connectedClients = [];

wss.on('connection', function(ws) {
    console.log('Got a web socket connection');
    connectedClients.push(ws);

    ws.on('message', function(message) {
        console.log('Got a web socket message');
        connectedClients.forEach(function(client) {
            client.send(message);
        });
    });
    ws.on('close', function() {
        console.log('Web socket closed');
        connectedClients = _.without(connectedClients, ws);
    });
});
