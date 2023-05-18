const connectToVoice = (channel: any) => {
  // Create Peer is called within a loop, runs once per user in the channel
  function createPeer(userToSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    //Listen for signal event, which starts handshake request to other users
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending_signal", {
        userToSignal,
        callerID,
        signal,
        user_id: userState.id,
        username: userState.username,
        user_avatar_url: userState.avatar_url,
      });
    });
    return peer;
  }
  // Add Peer is called whenever someone joins the channel after we are already in the channel
  function addPeer(incomingSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    //Listen for signal event, which completes handshake request from other user
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning_signal", {
        signal,
        callerID,
        user_id: userState.id,
        username: userState.username,
        user_avatar_url: userState.avatar_url,
      });
    });
    //Accept the signal
    peer.signal(incomingSignal);
    return peer;
  }
  let constraints: any = {};
  if (isMobile || !currentInputDevice || !currentOutputDevice) {
    //Use default devices if not set
    constraints.audio = true;
  } else {
    //Use saved devices if set
    constraints.audio = currentInputDevice.deviceId;
    constraints.output = currentOutputDevice.deviceId;
  }
  navigator.mediaDevices.getUserMedia(constraints).then((currentStream) => {
    userAudio.current = {};
    userAudio.current.srcObject = currentStream;
    console.log("socket id??? ", socketRef.current.id);
    socketRef.current.emit("join_channel", {
      channelId: channel.id,
      user_id: userState.id,
      username: userState.username,
      user_avatar_url: userState.avatar_url,
    });
    socketRef.current.on("all_users", (participants: any) => {
      const tempPeers: any = [];
      // Loop through all participants in channel and create a peer
      participants.forEach((participant: any) => {
        const peer = createPeer(participant.socket_id, socketRef.current.id, currentStream);
        peersRef.current.push({
          peerID: participant.socket_id,
          peer,
        });
        tempPeers.push(peer);
      });
      //TODO, make array of user objects to display in voice chat with name and avatar
      setpeers(tempPeers);
      renderCallParticipants(false, [...participants]);
      //Only Set saved socket after JOINING a voice room
      localStorage.setItem("voiceSocketId", socketRef.current.id);
      console.log("setting socket storage: ", localStorage.getItem("voiceSocketId"));
    });
    socketRef.current.on("user_joined", (payload: any) => {
      console.log("incoming person requesting handshake: ", payload.username);
      const peer = addPeer(payload.signal, payload.callerID, currentStream);
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      });
      setpeers((users: any) => [...users, peer]);
      renderCallParticipants(true, [payload]);
    });
    socketRef.current.on("receiving_returned_signal", (payload: any) => {
      const item = peersRef.current.find((p: any) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });
    socketRef.current.on("user_left", (payload: any) => {
      console.log("User left, remaining users: ", payload);
      const item = peersRef.current.find((p: any) => p.peerID === payload.id);
      setpeers((previousPeers) => {
        const tempPeers: any = [];
        previousPeers.forEach((loopPeer) => {
          if (loopPeer._id !== item.peer._id) {
            tempPeers.push(loopPeer);
          }
        });
        return tempPeers;
      });
      renderCallParticipants(false, payload.remaining_participants);
    });
    socketRef.current.on("user_disconnected", (payload: any) => {
      console.log("User disconnected: ", payload.id);

      const item = peersRef.current.find((p: any) => p.peerID === payload.id);
      let storedID = "";
      if (item) {
        storedID = item.peer._id;
        item.peer.destory();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== payload.id);
      peersRef.current = peers;
      setpeers((previousPeers) => {
        const tempPeers: any = [];
        previousPeers.forEach((loopPeer) => {
          if (loopPeer._id !== storedID) {
            tempPeers.push(loopPeer);
          }
        });
        return tempPeers;
      });
      if (payload.participants) {
        renderCallParticipants(false, payload.participants);
      }
    });
    //Called after user disconnects, responds with active participants
  });
  renderCallParticipants(false, []);
};

const disconnectFromVoice = () => {
  //Disconnect from voice
  // console.log("disconnecting!!!!!!!!! ", socketRef.current);

  const locationOfLastSlash = locationPath.lastIndexOf("/");
  const channelId = parseInt(locationPath.substring(locationOfLastSlash + 1));
  socketRef.current.emit("pre_disconnect", {
    channelId,
    user_id: userState.id,
    username: userState.username,
    user_avatar_url: userState.avatar_url,
  });

  peers.forEach((tempPeer) => {
    tempPeer.disconnect();
    tempPeer.destroy();
  });
  setpeers([]);
  // socketRef.current.disconnect();
  setcurrentAudioChannel({});
  setcallParticipants([]);
};
