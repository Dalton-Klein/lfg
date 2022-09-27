import './chat.scss';
import { Menu } from 'primereact/menu';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import moment from 'moment';
import { howLongAgo } from '../../utils/helperFunctions';
import { getChatHistoryForUser } from '../../utils/rest';
import { Toast } from 'primereact/toast';
import * as io from 'socket.io-client';
const socketRef = io.connect(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.gangs.gg');

export default function Chat(props: any) {
	const userState = useSelector((state: RootState) => state.user.user);

	const [platformImage, setPlatformImage] = useState<any>([]);
	// const [platformUsername, setPlatformUsername] = useState<any>('');
	const [messageState, setMessageState] = useState<any>({
		roomId: 1,
		message: '',
		senderId: userState.id,
		sender: userState.username,
		timestamp: '',
	});
	const [chat, setChat] = useState<any>([]);
	const toast: any = useRef({ current: '' });
	const dropdownMenu: any = useRef(null);
	const lastMessageRef: any = useRef(null);

	//Initial setup of chat window
	useEffect(() => {
		determinePlatformImageAndUsername();
		if (userState.id && userState.id > 0) {
			loadChatHistory();
			socketRef.emit('join_room', props.id);
			return () => {
				setPlatformImage([]);
				setMessageState({
					roomId: 1,
					message: '',
					senderId: userState.id,
					sender: userState.username,
					timestamp: '',
				});
				setChat([]);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//BEGIN Update messages list after each chat sent
	useEffect(() => {
		socketRef.on('message', ({ roomId, senderId, sender, message, timestamp }: any) => {
			setChat([...chat, { roomId, senderId, sender, message, timestamp }]);
		});
		lastMessageRef.current?.scrollIntoView();
	}, [chat]);
	//END Update messages list after each chat sent

	//This use effect is triggered when flipping between conversations (rooms)
	useEffect(() => {
		setChat([
			{
				connection_id: 1,
				created_at: `${moment().format()}`,
				id: 0,
				message: 'loading...',
				sender: 'gangs team',
				updated_at: `${moment().format()}`,
				username: 'gangs team',
			},
		]);
		if (userState.id && userState.id > 0) {
			setMessageState({ ...messageState, roomId: props.id });
			determinePlatformImageAndUsername();
			loadChatHistory();
			socketRef.emit('join_room', props.id);
			lastMessageRef.current?.scrollIntoView();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	const determinePlatformImageAndUsername = () => {
		// if (props.preferred_platform === 1) setPlatformUsername(props.discord);
		// else if (props.preferred_platform === 2) setPlatformUsername(props.psn);
		// else if (props.preferred_platform === 3) setPlatformUsername(props.xbox);
		const assetLinks: any = {
			1: '/assets/discord-logo-small.png',
			2: '/assets/psn-logo-small.png',
			3: '/assets/xbox-logo-small.png',
		};
		let assetLink = assetLinks[props.preferred_platform];
		const isPublic = props.isPublicChat === 'true' ? true : false;
		if (props.preferred_platform) {
			setPlatformImage(
				<div className="messaging-platform-box" style={{ display: !isPublic ? 'inline-block' : 'none' }}>
					<img className="connection-platform-image" src={assetLink} alt={`platform name`} />
				</div>
			);
		} else setPlatformImage(<></>);
	};

	//BEGIN SOCKET Functions
	const loadChatHistory = async () => {
		const historicalChatData = await getChatHistoryForUser(userState.id, props.id, '');
		if (historicalChatData && historicalChatData.length) setChat([...historicalChatData]);
		else setChat([]);
	};

	const onTextChange = (e: any) => {
		setMessageState({ ...messageState, message: e.target.value });
	};

	const onMessageSubmit = (e: any) => {
		const { roomId, senderId, sender, message } = messageState;
		const timestamp = moment().format();
		if (message.length > 750) {
			toast.current.clear();
			toast.current.show({
				severity: 'warn',
				summary: 'message length exceeded',
				detail: `message length 5 is longer than the cap of 750 characters`,
				sticky: true,
			});
		} else {
			socketRef.emit('message', { roomId, senderId, sender, message, timestamp });
			e.preventDefault();
			setMessageState({ roomId, senderId, sender, message: '', timestamp });
		}
	};
	const renderChat = () => {
		if (chat.length) {
			return chat.map(({ sender, message, created_at }: any, index: number) => {
				const formattedTimestamp = howLongAgo(created_at);
				return (
					<div
						className={
							sender === userState.username
								? 'message-bubble message-border-owner'
								: 'message-bubble message-border-non-owner'
						}
						key={index}
					>
						<div className="message-sender-box">
							<div className="message-sender-name">{sender}</div>
							<div className="message-timestamp">{formattedTimestamp}</div>
						</div>
						<div className="message-content">{message}</div>
					</div>
				);
			});
		} else {
			return (
				<div className="message-bubble message-border-non-owner">
					<div className="message-sender-box">
						<div className="message-sender-name">gangs team</div>
						<div className="message-timestamp"></div>
					</div>
					<div className="message-content">no messages yet, go ahead and say hi!</div>
				</div>
			);
		}
	};
	//END SOCKET Functions

	const items = [
		{
			items: [
				{
					label: 'block',
					icon: 'pi pi-user-minus',
					command: () => {},
				},
			],
		},
	];
	return (
		<div className="messages-box">
			<Toast ref={toast} />
			{/* Message Title Bar */}
			<div className="messages-title-container">
				{props.avatar_url === '' || props.avatar_url === '/assets/avatarIcon.png' ? (
					<div
						className="dynamic-conversation-border"
						onClick={() => {
							props.openConversation();
						}}
					>
						<div className="dynamic-conversation-text-small">
							{props.username
								.split(' ')
								.map((word: string[]) => word[0])
								.join('')
								.slice(0, 2)}
						</div>
					</div>
				) : (
					<img
						onClick={() => {
							props.callOpenConversation(props);
						}}
						className="conversation-profile-image"
						src={props.avatar_url}
						alt={`${props.username}'s profile`}
					/>
				)}
				<div className="messages-title-text">{props.username}</div>
				<div className="stackable-container-right">{platformImage}</div>
				<Menu model={items} popup ref={dropdownMenu} id="popup_menu" />
				<button className="options-button" onClick={(event) => dropdownMenu.current.toggle(event)}>
					<i className="pi pi-ellipsis-h"></i>
				</button>
			</div>
			{/* Messages Scroll Box */}
			<div className="render-chat">
				{renderChat()}
				<div ref={lastMessageRef} />
			</div>

			{/* Message Input Form */}
			<form className="message-form" onSubmit={onMessageSubmit}>
				<input
					onChange={(e) => {
						onTextChange(e);
					}}
					value={messageState.message ? messageState.message : ''}
					className="input-box messaging-input"
					placeholder={'type here...'}
				></input>

				<button type="submit">send</button>
			</form>
		</div>
	);
}
