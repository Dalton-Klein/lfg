require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3010;
const router = require("./routes/router");
const db = require("./models/index");
const http = require("http").createServer(app);
router.use(express.json());
const session = require("express-session");
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use(cors(), router);
app.use(require("prerender-node").set("prerenderToken", "pmAz691dTZfZ6GTrUiZZ"));
const path = require("path");
const { main } = require("./startup/startup");
const messageController = require("./controllers/message-controller");

//START SOCKET
io = require("socket.io")(http);
//Secret to making io emit events available in controllers is to set io as global variable
global._io = io;

//wrap session middleware to connect it to socket io
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
//Declare middleware function
// io.use((socket, next) => {
//   const session = socket.request.session;
//   if (session && session.authenticated) {
//     next();
//   } else {
//     next(new Error("unauthorized"));
//   }
// });

const allUsersInAllChannels = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  //START DM EVENTS
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
  //END DM EVENTS

  //START VOICECHAT EVENTS
  const storedSocketId = socket.handshake.query.socketId;
  console.log("stored Socket Id: ", storedSocketId, " current ", socket.id);
  // User Starts a voice channel (group voice)
  socket.on("join_channel", (payload) => {
    //Attach user information to this socket for use in disconnect
    console.log("socket.request.session: ", socket.request.session);
    socket.request.session.user = {
      user_id: payload.user_id,
      username: payload.username,
      user_avatar_url: payload.user_avatar_url,
    };
    socket.request.session.save();
    console.log("socket id??? ", socket.id);
    console.log("joining and setting info: ", socket.request.session.user);
    if (allUsersInAllChannels[payload.channelId]) {
      //Get rid of duplicate users
      allUsersInAllChannels[payload.channelId] = allUsersInAllChannels[payload.channelId].filter((participant) => {
        if (participant.user_id == payload.user_id) {
          return false;
        } else {
          return true;
        }
      });
      //Add fresh copy of joining user
      allUsersInAllChannels[payload.channelId].push({
        socket_id: socket.id,
        user_id: payload.user_id,
        username: payload.username,
        user_avatar_url: payload.user_avatar_url,
      });
    } else {
      //Create channel object for channel id
      allUsersInAllChannels[payload.channelId] = [
        {
          socket_id: socket.id,
          user_id: payload.user_id,
          username: payload.username,
          user_avatar_url: payload.user_avatar_url,
        },
      ];
    }
    socketToRoom[socket.id] = payload.channelId;
    let usersInThisRoomOtherThanYou = [];
    allUsersInAllChannels[payload.channelId].forEach((userObj) => {
      if (userObj.socket_id !== socket.id) usersInThisRoomOtherThanYou.push(userObj);
    });
    console.log("joining channel -> all users?", allUsersInAllChannels[payload.channelId]);
    //Send joining user array of participants other than self
    socket.emit("all_users", usersInThisRoomOtherThanYou);
  });

  socket.on("sending_signal", (payload) => {
    console.log("sending handshake API", payload.callerID, " signaling: ", payload.userToSignal);
    io.to(payload.userToSignal).emit("user_joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      user_id: payload.user_id,
      username: payload.username,
      user_avatar_url: payload.user_avatar_url,
    });
  });

  socket.on("returning_signal", (payload) => {
    io.to(payload.callerID).emit("receiving_returned_signal", {
      signal: payload.signal,
      id: socket.id,
      user_id: payload.user_id,
      username: payload.username,
      user_avatar_url: payload.user_avatar_url,
    });
  });

  //When client disconnects, handle it
  // socket.on("pre_disconnect", (payload) => {
  //   console.log("pre_disconnect: ", payload);
  //   if (allUsersInAllChannels[payload.channelId]) {
  //     allUsersInAllChannels[payload.channelId] = allUsersInAllChannels[payload.channelId].filter((participant) => {
  //       if (participant.user_id == payload.user_id) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     });
  //     allUsersInAllChannels[payload.channelId].forEach((participant) => {
  //       io.to(participant.socket_id).emit("user_left", {
  //         id: socket.id,
  //         remaining_participants: allUsersInAllChannels[payload.channelId],
  //       });
  //     });
  //   }
  // });
  //END VOICECHAT EVENTS

  socket.on("disconnecting", () => {
    console.log("User disconnecting!! ", socket.id);
    let user;
    // Find original socket connection (when user refreshed page we have new socket id)
    const originalSocket = io.sockets.sockets.get(storedSocketId);
    console.log(`disconnect session obj:`, originalSocket);

    let foundChannelRemovingFrom;
    if (socket.request.session && socket.request.session.user) {
      user = socket.request.session.user;
      for (const channelId in allUsersInAllChannels) {
        if (Object.hasOwnProperty.call(allUsersInAllChannels, channelId)) {
          const channel = allUsersInAllChannels[channelId];
          const tempArray = [];
          channel.forEach((participant) => {
            if (participant.user_id !== socket.request.session.user.user_id) {
              tempArray.push(participant);
            } else {
              foundChannelRemovingFrom = channelId;
            }
          });
          allUsersInAllChannels[channelId] = tempArray;
        }
      }
    }
    let resultingParticipants;
    if (foundChannelRemovingFrom) {
      resultingParticipants = allUsersInAllChannels[foundChannelRemovingFrom];
    } else {
      resultingParticipants = undefined;
    }
    console.log("test?? ", resultingParticipants);
    socket.broadcast.emit("user_disconnected", { id: socket.id, participants: resultingParticipants });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ", socket.id);
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
