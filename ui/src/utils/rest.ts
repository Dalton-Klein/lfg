import { SignUpForm, SignInForm } from "./interfaces";
require("dotenv").config();
const endpointURL: String = "";

const avatarCloud = `https://api.cloudinary.com/v1_1/techlog-cloud-key/upload`;

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

export const signInUser = async (user: SignInForm) => {
  const { email, password } = user;
  let result = await fetch(`${endpointURL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
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
  let result = await fetch(`${endpointURL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vKey,
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Password Reset ERROR", err));
  return result;
};

// POST RELATED REQUESTS
export const getPosts = async (userId: number, token: string) => {
  return await fetch(`${endpointURL}/posts`, {
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
    .catch((err) => {
      console.log(`${err} while fetching ALL CHATS`);
    });
};

/*
	Update User Data Calls
*/
export const uploadAvatarCloud = async (user: number, avatar: any) => {
  const formData = new FormData();
  formData.append("upload_preset", "ppgbubn6");
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

export const uploadAvatarServer = async (id: number, url: string) => {
  await fetch(`${endpointURL}/userAvatar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: id,
      avatarUrl: url,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Fetch Error (avatar)", err));
  return;
};

export const changeUserName = async (id: number, trainerName: string) => {
  await fetch(`${endpointURL}/changeUserName`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: id,
      trainerName: trainerName,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Fetch Error (avatar)", err));
  return;
};

/*
	Posts Calls
*/
export const getCategoriesAndTopics = async () => {
  let call = {};
  await fetch(`${endpointURL}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => (call = data))
    .catch((err) => console.log("Get categories error: ", err));
  return call;
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
