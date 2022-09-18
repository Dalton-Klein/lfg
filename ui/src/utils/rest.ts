import { SignUpForm, SignInForm } from './interfaces';
require('dotenv').config();
const endpointURL: String = '';

const avatarCloud = `https://api.cloudinary.com/v1_1/kultured-dev/upload`;

/*
	Auth Calls
*/
export const verifyUser = async (email: string, vKey: string, name: string, password: string) => {
	let result = await fetch(`${endpointURL}/verify`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		.catch((err) => console.log('VERIFY USER ERROR', err));
	return result;
};

export const createUser = async (user: SignUpForm) => {
	const { name, email } = user;
	let result = await fetch(`${endpointURL}/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: name,
			email,
		}),
	})
		.then((res) => res.json())
		.then((data) => data)
		.catch((err) => console.log('CREATE USER ERROR', err));
	return result;
};

export const signInUser = async (user: SignInForm) => {
	const { email, password } = user;
	let result = await fetch(`${endpointURL}/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	})
		.then((res) => res.json())
		.then((data) => data)
		.catch((err) => console.log('SIGN IN USER ERROR', err));
	return result;
};

export const requestPasswordReset = async (email: string) => {
	let result = await fetch(`${endpointURL}/forgot-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
		}),
	})
		.then((res) => res.json())
		.then((data) => data)
		.catch((err) => console.log('Password Reset Request ERROR', err));
	return result;
};

export const resetPassword = async (email: string, vKey: string, password: string) => {
	try {
		let httpResult = await fetch(`${endpointURL}/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
		console.log('Password Reset ERROR', error);
	}
};

// SOCIAL RELATED REQUESTS
export const getRustTiles = async (userId: number, token: string) => {
	try {
		const httpResult = await fetch(`${endpointURL}/rust-tiles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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

export const getProfileSocialData = async (fromUserId: number, forUserId: number, token: string) => {
	try {
		const httpResult = await fetch(`${endpointURL}/social`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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

export const createConnectionRequest = async (
	fromUserId: number,
	forUserId: number,
	platform: number,
	connectionText: string,
	token: string
) => {
	try {
		const httpResult = await fetch(`${endpointURL}/connection-request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId,
		}),
	})
		.then((res) => res.json())
		.then((data) => data)
		.catch((err) => console.log('FETCH USER DATA ERROR', err));
	return result;
};

export const uploadAvatarCloud = async (avatar: any) => {
	const formData = new FormData();
	formData.append('upload_preset', 'ribyujnm');
	formData.append('file', avatar.files[0]);
	let response;
	await fetch(avatarCloud, {
		method: 'POST',
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => (response = data.url))
		.catch((err) => console.log('Fetch error (CLOUDINARY)', err));
	return response;
};

export const uploadAvatarServer = async (id: number, url: string) => {
	await fetch(`${endpointURL}/userAvatar`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			userId: id,
			field: 'avatar_url',
			value: url,
		}),
	})
		.then((res) => res.json())
		.catch((err) => console.log('Fetch Error (avatar)', err));
	return;
};

export const updateGeneralInfoField = async (id: number, field: string, value: any) => {
	try {
		const httpResult = await fetch(`${endpointURL}/updateGeneralInfoField`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
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

/*
	Publish Calls
*/
export const attemptPublishRustProfile = async (userId: number, token: string) => {
	return await fetch(`${endpointURL}/publish-rust`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
	Posts Calls
*/
export const getCategoriesAndTopics = async () => {
	try {
	} catch (error) {
		console.log('Get categories error: ', error);
	}
	const httpResult = await fetch(`${endpointURL}/tags`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const jsonify = httpResult.json();
	return jsonify;
};

export const createPost = async (post: any) => {
	let call = {};
	await fetch(`${endpointURL}/create-post`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			post,
		}),
	})
		.then((res) => res.json())
		.then((data) => (call = data))
		.catch((err) => console.log('GET USER ERROR', err));
	return call;
};

/*
	Profile Calls
*/
export const getUserPublicDetails = async (id: number) => {
	let call = {};
	await fetch(`${endpointURL}/getPublicDetails`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: id,
		}),
	})
		.then((res) => res.json())
		.then((data) => (call = data))
		.catch((err) => console.log('GET USER ERROR', err));
	return call;
};

export const seeIfChatExists = async (seller: number, buyer: number, itemId: number) => {
	let result;
	await fetch(`${endpointURL}/seeIfChatExists`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			seller,
			buyer,
			itemId,
		}),
	})
		.then((res) => res.json())
		.then((data) => (result = data))
		.catch((err) => console.log('CREATE CHAT ERROR', err));
	return result;
};

export const getAllChatsForUser = async (userId: number) => {
	return await fetch(`${endpointURL}/getAllChatsForUser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sender,
			content,
			PrivateChatId,
		}),
	})
		.then((res) => res.json)
		.catch((err) => console.log('CREATE MESSAGE ERROR', err));
};
