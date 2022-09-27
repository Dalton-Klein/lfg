import './aboutComponent.scss';
import { howLongAgo } from '../../../utils/helperFunctions';
import { getNotificationsGeneral } from '../../../utils/rest';
import * as io from 'socket.io-client';
import { useEffect, useState } from 'react';
const socketRef = io.connect(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.gangs.gg');

export default function HomePage() {
	const [notifications, setnotifications] = useState<any>([]);

	useEffect(() => {
		loadNotificationHistory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//BEGIN Update notifications list after each notification sent
	useEffect(() => {
		socketRef.on('notification', ({ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }: any) => {
			setnotifications([{ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }, ...notifications]);
			renderNotifications();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifications]);
	//END Update notifications list after each notification sent

	//BEGIN SOCKET Functions
	const loadNotificationHistory = async () => {
		const historicalNotifications = await getNotificationsGeneral();
		setnotifications([...historicalNotifications]);
		socketRef.emit('join_room', `notifications-general`);
	};
	const renderNotifications = () => {
		if (notifications.length) {
			let items: any = [];
			let ownerName;
			let otherName;
			const actionPhrases: any = {
				1: `${otherName} sent ${ownerName} a connection request`,
				2: `${otherName} accepted ${ownerName}'s connection request`,
				3: `${otherName} sent ${ownerName} a message`,
				4: `${ownerName} signed up!`,
			};
			notifications.forEach((notif: any) => {
				items.push(
					<div className="notification-container">
						{notif.other_user_avatar_url === '' ||
						notif.other_user_avatar_url === '/assets/avatarIcon.png' ||
						notif.other_user_avatar_url === null ? (
							<div className="dynamic-avatar-border">
								<div className="dynamic-avatar-text-small">
									{notif.other_username === null
										? 'gg'
										: notif.other_username
												.split(' ')
												.map((word: string[]) => word[0])
												.join('')
												.slice(0, 2)}
								</div>
							</div>
						) : (
							<img
								className="notification-profile-image"
								src={notif.other_user_avatar_url}
								alt={`${notif.other_username}'s avatar`}
							/>
						)}
						<div className="notification-username"> {notif.other_username}</div>
						{actionPhrases[notif.type_id]}
						<div className="notification-timestamp">{howLongAgo(notif.created_at)}</div>
					</div>
				);
			});
			return items;
		}
	};
	//END SOCKET Functions

	return (
		<div className="about-container">
			<div className="column-1">
				<div className="about-text">
					finding suitable teammates is tough. finding them here isn't. find teammates based on criteria that matters to
					you.
				</div>
			</div>
			<div className="column-2">
				<div className="connection-feed">Dalton connected with Madison 4 minutes ago.</div>
			</div>
		</div>
	);
}
