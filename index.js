require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3010;
const router = require("./routes/router");
const db = require("./models/index");
const http = require("http").createServer(app);
router.use(express.json());
app.use(cors(), router);
app.use(require("prerender-node").set("prerenderToken", "pmAz691dTZfZ6GTrUiZZ"));
const path = require("path");
const { main } = require("./startup/startup");
const messageController = require("./controllers/message-controller");

//START SOCKET
io = require("socket.io")(http);
//Secret to making io emit events available in controllers is to set io as global variable
global._io = io;
const util = require("util");

const peers = [];

const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  // User Joins a dm room (private messaging)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("User JOINED ROOM ", roomId);
  });

  //Listen for dm chat messages from users
  socket.on("message", ({ roomId, senderId, sender, message, timestamp }) => {
    messageController.saveMessage(roomId, senderId, message, timestamp);
    io.to(roomId).emit("message", { roomId, senderId, sender, message, timestamp });
  });

  // User Starts a voice channel (group voice)
  //MY OWN HOME GROWN, FALLBACK
  // socket.on("join_channel", (payload) => {
  //   console.log("User JOINED Voice Channel ", payload.channelId);
  //   peers.push(payload.peer);
  //   socket.join(payload.channelId);
  //   // Send update of connected peers data to all connected peers
  //   io.to(payload.channelId).emit("update_channel", { channelId: payload.channelId, peers: peers });
  // });
  socket.on("join room", (payload) => {
    console.log("joining payload: ", payload);
    if (users[payload.channelId]) {
      const length = users[payload.channelId].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[payload.channelId].push(socket.id);
    } else {
      users[payload.channelId] = [socket.id];
    }
    socketToRoom[socket.id] = payload.channelId;
    const usersInThisRoom = users[payload.channelId].filter((id) => id !== socket.id);
    console.log("usersInThisRoom?", usersInThisRoom);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    console.log("sending handshake API", payload.callerID, " signaling: ", payload.userToSignal);
    io.to(payload.userToSignal).emit("user joined", { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
  });

  //When client disconnects, handle it
  socket.on("disconnect", () => {
    const clientDisconnectedMsg = "User disconnected " + util.inspect(socket.id);
    // Remove client from peers list TODO
    // peers = peers.filter(function (peer) {
    //   return peer.userId !== ;
    // });
    io.emit(clientDisconnectedMsg);
    console.log(clientDisconnectedMsg);

    // Handle removal from voice
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

//END SOCKET
(async () => {
  try {
    // await db.sequelize.sync({ force: true });
    await db.sequelize.sync();
    await main();
    // coffee old code to serve what is in public
    // app.use(express.static(path.join(__dirname + '/public')));
    if (process.env.IS_PROD == "1") {
      //Serve static content if production
      app.use(express.static(path.join(__dirname, "/ui/build")));
      app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "/ui/build/index.html"));
      });
    }
    http.listen(process.env.PORT || PORT);
    console.log(`🌈Conected to DB, Server listening on port ${PORT}🌈`); // eslint-disable-line no-console
  } catch (e) {
    console.error("☹️Error connecting to the db ☹️ ", e); // eslint-disable-line no-console
  }
})();
