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
  console.log("joining socket id: ", socket.id);
  console.log("joining user id: ", socket.request.session.user.user_id);
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
socket.on("pre_disconnect", (payload) => {
  console.log("pre_disconnect: ", payload);
  if (allUsersInAllChannels[payload.channelId]) {
    allUsersInAllChannels[payload.channelId] = allUsersInAllChannels[payload.channelId].filter((participant) => {
      if (participant.user_id === payload.user_id) {
        return false;
      } else {
        return true;
      }
    });
    allUsersInAllChannels[payload.channelId].forEach((participant) => {
      console.log(
        "sending disconnevt info: ",
        participant.socket_id,
        " rezz ",
        allUsersInAllChannels[payload.channelId]
      );
      io.to(participant.socket_id).emit("user_left", {
        id: socket.id,
        remaining_participants: allUsersInAllChannels[payload.channelId],
      });
    });
  }
});
