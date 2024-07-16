
const app = require('./app');
const http = require('http');
const socketIO = require("socket.io")
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
    console.log('New client connected');
    socket.on("disconnect", () => {
        console.log('Client disconnected');

    })
})
app.set("socketio", io);
const port = PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));

