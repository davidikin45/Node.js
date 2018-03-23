(function (webSocket) {
    var socketio = require("socket.io");

    webSocket.init = function (server) {
        var io = socketio.listen(server);

        //A client has connected via web sockets
        io.sockets.on("connection", function (socket) {
            console.log("web socket was connected");

            //1. key, value > send to single client socket on connection.
            //socket.emit("showThis", "This is from the server");

            //2. join room
            socket.on("join category", function (name) {
                socket.join(name);
            });

            //3. Broadcast to everyone except socket we are already on.
            //socket.on("newNote", function (data) {
            //    socket.broadcast.emit("broadcast note", data.note);
            //});

            //4. Broadcast to everyone in room except socket we are already on.
            socket.on("newNote", function (data) {
                socket.broadcast.to(data.category).emit("broadcast note", data.note);
            });

        });

    };

})(module.exports);