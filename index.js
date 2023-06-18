require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3010;
const router = require("./routes/router");
const db = require("./models/index");
const http = require("http").createServer(app);
router.use(express.json());
const corsOptions = {
  origin: ["http://localhost:3000", "https://gangs.gg"], // http://localhost:3000 for electron, otherwise deployed ui
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions), router);
app.use(require("prerender-node").set("prerenderToken", "pmAz691dTZfZ6GTrUiZZ"));
const path = require("path");
const { main } = require("./startup/startup");
const messageController = require("./controllers/message-controller");

//START SOCKET
io = require("socket.io")(http);
//Secret to making io emit events available in controllers is to set io as global variable
global._io = io;

const allUsersInAllVoiceChannels = {};

io.on("connection", (socket) => {
  //START DM EVENTS
  // User Joins a dm room (private messaging)
  socket.on("join_room", (roomId) => {
    //First, disconnect from all connected rooms
    const allConnectedRooms = socket.rooms;
    const regexTest = /^notifications-\d+/;
    allConnectedRooms.forEach((room) => {
      if (room !== socket.id && !regexTest.test(room)) {
        socket.leave(room); // Leave each room (except the default room, which is the socket ID)
      }
    });
    //Now, connect to desired room
    socket.join(roomId);
    console.log("joining room: ", roomId);
  });

  //Listen for dm chat messages from users
  socket.on("message", ({ roomId, senderId, sender, message, isImage, timestamp }) => {
    messageController.saveMessage(roomId.substring(3), senderId, message, isImage, timestamp);
    io.to(roomId).emit("message", { roomId, senderId, sender, message, isImage, timestamp });
  });

  socket.on("gang_message", ({ roomId, senderId, sender, message, isImage, timestamp }) => {
    messageController.saveGangMessage(roomId.substring(5), senderId, message, isImage, timestamp);
    io.to(roomId).emit("message", { roomId, senderId, sender, message, isImage, timestamp });
  });
  //END DM EVENTS

  //START VOICECHAT EVENTS
  //         join voice is triggered only after user is already in voice "room"
  //         the purpose of this event is to update all observing users of the active call participants
  //         think of this like a message event but a voice disconnect/connect event
  socket.on("join_voice", ({ roomId, user_id, username, avatar_url }) => {
    //Remove old participant object if still listed in room
    if (allUsersInAllVoiceChannels[roomId]) {
      allUsersInAllVoiceChannels[roomId] = allUsersInAllVoiceChannels[roomId].filter(
        (participant) => participant.user_id !== user_id
      );
    }
    //Add user to list of participants
    if (!allUsersInAllVoiceChannels[roomId]) {
      allUsersInAllVoiceChannels[roomId] = [];
    }
    allUsersInAllVoiceChannels[roomId].push({
      socket_id: socket.id,
      user_id: user_id,
      username: username,
      avatar_url: avatar_url,
      isTalking: false,
    });
    //Send full copy of participants to everyone observing voice channel
    io.to(roomId).emit("join_voice", { user_joined: user_id, participants: allUsersInAllVoiceChannels[roomId] });
  });

  socket.on("leave_voice", ({ roomId, user_id }) => {
    //Remove participant object
    if (allUsersInAllVoiceChannels[roomId]) {
      allUsersInAllVoiceChannels[roomId] = allUsersInAllVoiceChannels[roomId].filter(
        (participant) => participant.user_id !== user_id
      );
    }
    //Send full copy of participants to everyone observing voice channel
    io.to(roomId).emit("leave_voice", {
      userLeaving: user_id,
      participants: allUsersInAllVoiceChannels[roomId],
    });
  });

  //Start Voice Activity Events
  socket.on("start_stop_talking", ({ roomId, user_id, isTalking }) => {
    //Modify is talking property for specific participant
    if (allUsersInAllVoiceChannels[roomId] && allUsersInAllVoiceChannels[roomId].length) {
      allUsersInAllVoiceChannels[roomId] = allUsersInAllVoiceChannels[roomId].map((participant) => {
        if (participant.user_id === user_id) {
          return { ...participant, ["isTalking"]: isTalking };
        }
        return participant;
      });
      //Send takling status of user to everyone observing voice channel
      io.to(roomId).emit("someone_talked", { user_id, isTalking });
    }
  });
  //End Voice Activity Events

  //Start Voice Handshaking Events
  socket.on("sending_signal", (payload) => {
    socket.broadcast.emit("receive_sent_signal", {
      signal: payload.signal,
      targetUser: payload.userIdToSignal,
      callerID: payload.callerID,
      user_id: payload.user_id,
      username: payload.username,
      user_avatar_url: payload.user_avatar_url,
    });
  });

  socket.on("returning_signal", (payload) => {
    socket.broadcast.emit("receiving_returned_signal", {
      signal: payload.signal,
      targetUser: payload.targetUser,
      id: socket.id,
      user_id: payload.user_id,
      username: payload.username,
      user_avatar_url: payload.user_avatar_url,
    });
  });
  //Start Voice Handshaking Events
  //END VOICECHAT EVENTS

  socket.on("disconnecting", () => {
    // let user;
    // // Find original socket connection (when user refreshed page we have new socket id)
    // const originalSocket = io.sockets.sockets.get(storedSocketId);
    // console.log("User disconnecting!! ", socket.id);
    // console.log(`disconnect original socket:`, originalSocket);
    // console.log(`disconnect session obj:`, socket.request.session.user);
    // let foundChannelRemovingFrom;
    // if (socket.request.session && socket.request.session.user) {
    //   user = socket.request.session.user;
    //   for (const channelId in allUsersInAllChannels) {
    //     if (Object.hasOwnProperty.call(allUsersInAllChannels, channelId)) {
    //       const channel = allUsersInAllChannels[channelId];
    //       const tempArray = [];
    //       channel.forEach((participant) => {
    //         if (participant.user_id !== socket.request.session.user.user_id) {
    //           tempArray.push(participant);
    //         } else {
    //           foundChannelRemovingFrom = channelId;
    //         }
    //       });
    //       allUsersInAllChannels[channelId] = tempArray;
    //     }
    //   }
    // }
    // let resultingParticipants;
    // if (foundChannelRemovingFrom) {
    //   resultingParticipants = allUsersInAllChannels[foundChannelRemovingFrom];
    // } else {
    //   resultingParticipants = undefined;
    // }
    // socket.broadcast.emit("user_disconnected", { id: socket.id, participants: resultingParticipants });
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
