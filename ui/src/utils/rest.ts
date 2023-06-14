import { SignUpForm, SignInForm } from "./interfaces";
require("dotenv").config();
// ***ELECTRON MAKE BLANK STRING IF NOT ELECTRON, https://gangs.gg IF ELECTRON
const endpointURL: String = "";

const avatarCloud = `https://api.cloudinary.com/v1_1/kultured-dev/upload`;

/*
	Auth Calls
*/
export const verifyUser = async (email: string, vKey: string, name: string, password: string) => {
  let result = await fetch(`${endpointURL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vKey,
      username: name,
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("VERIFY USER ERROR", err));
  return result;
};

export const createUser = async (user: SignUpForm) => {
  const { name, email } = user;
  let result = await fetch(`${endpointURL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: name,
      email,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("CREATE USER ERROR", err));
  return result;
};

export const signInUser = async (user: SignInForm, isGoogleSignIn: boolean) => {
  const { email, password } = user;
  let result = await fetch(`${endpointURL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      isGoogleSignIn,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("SIGN IN USER ERROR", err));
  return result;
};

export const googleSignIn = async (email: string) => {
  let result = await fetch(`${endpointURL}/google-signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("SIGN IN USER ERROR", err));
  return result;
};

export const requestPasswordReset = async (email: string) => {
  let result = await fetch(`${endpointURL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Password Reset Request ERROR", err));
  return result;
};

export const resetPassword = async (email: string, vKey: string, password: string) => {
  try {
    let httpResult = await fetch(`${endpointURL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vKey,
        email,
        password,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log("Password Reset ERROR", error);
  }
};

// SOCIAL RELATED REQUESTS
export const getUserCount = async (userId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/total-user-count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching user count`);
  }
};

export const getRustPlayerTiles = async (userId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/rust-tiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const getLFMGangTiles = async (user_id: number, game_platform_id: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/gang-tiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        game_platform_id,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const getRocketLeagueTiles = async (userId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/rocket-league-tiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rocket league tiles`);
  }
};

export const getGangTiles = async (userId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/get-gang-tiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rocket league tiles`);
  }
};

export const getProfileSocialData = async (fromUserId: number, forUserId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId,
        forUserId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching social data`);
  }
};

export const getEndorsementOptions = async (inputterId: number, receiverId: number, rust_is_published: boolean) => {
  try {
    const httpResult = await fetch(`${endpointURL}/endorsement-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputterId,
        receiverId,
        rust_is_published,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching endorsement options`);
  }
};

export const addEndorsement = async (typeId: number, senderId: number, receiverId: number, value: number) => {
  try {
    const httpResult = await fetch(`${endpointURL}/endorsement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typeId,
        senderId,
        receiverId,
        value,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while adding endorsement`);
  }
};

export const createConnectionRequest = async (
  fromUserId: number,
  forUserId: number,
  platform: number,
  connectionText: string,
  token: string
) => {
  try {
    const httpResult = await fetch(`${endpointURL}/connection-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId,
        forUserId,
        platform,
        connectionText,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while sending connection request`);
  }
};

/*
	Update User Data Calls
*/
export const fetchUserData = async (userId: number) => {
  let result = await fetch(`${endpointURL}/getUserDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("FETCH USER DATA ERROR", err));
  return result;
};

export const fetchUserDataAndConnectedStatus = async (originatingUserId: number, requestedUserId: number) => {
  let result = await fetch(`${endpointURL}/getUserDetailsAndConnectedStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originatingUserId,
      requestedUserId,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("FETCH USER DATA ERROR", err));
  return result;
};

export const uploadAvatarCloud = async (avatar: any) => {
  const formData = new FormData();
  formData.append("upload_preset", "ribyujnm");
  formData.append("file", avatar.files[0]);
  let response;
  await fetch(avatarCloud, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => (response = data.url))
    .catch((err) => console.log("Fetch error (CLOUDINARY)", err));
  return response;
};

export const updateUserField = async (id: number, field: string, value: any) => {
  await fetch(`${endpointURL}/updateUserInfoField`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: id,
      field,
      value,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Fetch Error (avatar)", err));
  return;
};

export const updateGeneralInfoField = async (id: number, field: string, value: any) => {
  try {
    const httpResult = await fetch(`${endpointURL}/updateGeneralInfoField`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        field,
        value,
      }),
    });
    return httpResult.json();
  } catch (error) {
    console.log(`${error} while updating general profile info`);
  }
};

export const updateGameSpecificInfoField = async (id: number, table: string, field: string, value: any) => {
  try {
    const httpResult = await fetch(`${endpointURL}/updateGameSpecificInfoField`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        table,
        field,
        value,
      }),
    });
    return httpResult.json();
  } catch (error) {
    console.log(`${error} while updating general profile info`);
  }
};

/*
	Publish Calls
*/
export const getAllPublishStatus = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/all-publication-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};
export const checkGeneralProfileCompletion = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/general-profile-completion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};
export const checkRustProfileCompletion = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/rust-profile-completion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};

export const checkRocketLeagueProfileCompletion = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/rocket-league-profile-completion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};

export const attemptPublishRustProfile = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/publish-rust`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};

export const attemptPublishRocketLeagueProfile = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/publish-rocket-league`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} trying to validate the publishing of rust profile`);
    });
};

/*
	Connections Calls
*/
export const getConnectionsForUser = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching connections`);
    });
};

export const getPendingConnectionsForUser = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/pending-connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching pending connections`);
    });
};

export const acceptConnectionRequest = async (
  acceptorId: number,
  senderId: number,
  platform: number,
  pendingId: number,
  token: string
) => {
  return await fetch(`${endpointURL}/accept-connection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      acceptorId,
      senderId,
      platform,
      pendingId,
      token,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while accepting connection request`);
    });
};

/*
	Socket Calls
*/
export const getChatHistoryForUser = async (userId: number, chatId: number, token: string) => {
  let result = await fetch(`${endpointURL}/get-chat-history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      chatId,
      token,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Error while fetching chat history", err));
  return result;
};

export const getChatHistoryForGang = async (userId: number, channelId: number, token: string) => {
  let result = await fetch(`${endpointURL}/get-gang-chat-history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      channelId,
      token,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Error while fetching chat history", err));
  return result;
};

export const getNotificationsUser = async (userId: number, token: string) => {
  let result = await fetch(`${endpointURL}/get-notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      token,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Error while fetching notification history", err));
  return result;
};

export const getNotificationsGeneral = async () => {
  let result = await fetch(`${endpointURL}/get-notifications-general`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Error while fetching notification history", err));
  return result;
};

/*
	Posts Calls
*/
export const getCategoriesAndTopics = async () => {
  try {
  } catch (error) {
    console.log("Get categories error: ", error);
  }
  const httpResult = await fetch(`${endpointURL}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonify = httpResult.json();
  return jsonify;
};

export const createPost = async (post: any) => {
  let call = {};
  await fetch(`${endpointURL}/create-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post,
    }),
  })
    .then((res) => res.json())
    .then((data) => (call = data))
    .catch((err) => console.log("GET USER ERROR", err));
  return call;
};

/*
	Profile Calls
*/
export const getUserPublicDetails = async (id: number) => {
  let call = {};
  await fetch(`${endpointURL}/getPublicDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => res.json())
    .then((data) => (call = data))
    .catch((err) => console.log("GET USER ERROR", err));
  return call;
};

export const seeIfChatExists = async (seller: number, buyer: number, itemId: number) => {
  let result;
  await fetch(`${endpointURL}/seeIfChatExists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seller,
      buyer,
      itemId,
    }),
  })
    .then((res) => res.json())
    .then((data) => (result = data))
    .catch((err) => console.log("CREATE CHAT ERROR", err));
  return result;
};

export const getAllChatsForUser = async (userId: number) => {
  return await fetch(`${endpointURL}/getAllChatsForUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching ALL CHATS`);
    });
};

export const getSingleChatForUser = async (chatId: number) => {
  return await fetch(`${endpointURL}/getSingleChatForUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching ALL CHATS`);
    });
};

export const getChatById = async (chatId: number) => {
  return await fetch(`${endpointURL}/getMessages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: chatId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching chatByItemeId`);
    });
};

export const getNumChatsByItem = async (itemId: number) => {
  return await fetch(`${endpointURL}/getNumChatsByItem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(`${err} while fetching chatByItemeId`);
    });
};

export const sendMessage = (sender: number, content: string, PrivateChatId: number) => {
  fetch(`${endpointURL}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
      content,
      PrivateChatId,
    }),
  })
    .then((res) => res.json)
    .catch((err) => console.log("CREATE MESSAGE ERROR", err));
};

// ** START GANG ROUTES
export const createNewGang = async (userId: number, gang: any) => {
  try {
    console.log("??? ", gang);
    const httpResult = await fetch(`${endpointURL}/create-gang`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        gang,
      }),
    });
    return httpResult.json();
  } catch (error) {
    console.log(`${error} while updating general profile info`);
  }
};
export const updateGangInfoField = async (id: number, field: string, value: any) => {
  try {
    const httpResult = await fetch(`${endpointURL}/updateGangInfoField`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        field,
        value,
      }),
    });
    return httpResult.json();
  } catch (error) {
    console.log(`${error} while updating general profile info`);
  }
};
export const getMyGangTiles = async (userId: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/my-gangs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const getGangActivity = async (gang_id: number, user_id: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/gang-activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gang_id,
        user_id,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const getGangRequests = async (id: number, is_for_user: boolean, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/gang-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        is_for_user,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const checkGangRequest = async (user_id: number, gang_id: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/check-gang-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        gang_id,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const acceptGangConnectionRequest = async (request_id: number, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/accept-gang-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const searchUserByUsername = async (inputString: string, token: string) => {
  try {
    const httpResult = await fetch(`${endpointURL}/search-user-by-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputString,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const requestToJoinGang = async (
  gang_id: number,
  user_id: number,
  is_user_asking_to_join: boolean,
  token: string
) => {
  try {
    const httpResult = await fetch(`${endpointURL}/request-join-gang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gang_id,
        user_id,
        is_user_asking_to_join,
        token,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching rust tiles`);
  }
};

export const updateGangField = async (id: number, field: string, value: any) => {
  await fetch(`${endpointURL}/update-gang-field`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gangId: id,
      field,
      value,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Fetch Error (avatar)", err));
  return;
};
// ** END GANG ROUTES
