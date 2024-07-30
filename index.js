const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-direct-client.vercel.app",
    methods: ["GET", "POST"],
  },
});

// user connexion
io.on("connection", (socket) => {
  console.log(`User ${socket.id} is connected`);

  // User join room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} join room ${data}`);
  });

  // user send message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // user leave room
  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log(`User ${socket.id} leave of room ${data}`);
  });

  // user disconnect of website
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} is disconnected`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUN");
});

module.exports = app;
