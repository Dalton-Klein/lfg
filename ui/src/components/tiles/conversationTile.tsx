import './conversationTile.scss';

export default function ConversationTile(props: any) {
	return (
		<div className="conversation-tile">
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
		</div>
	);
}
