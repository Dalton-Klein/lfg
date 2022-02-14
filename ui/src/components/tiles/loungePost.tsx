import React from 'react'
import '../../styling/loungePage.scss';
export default function loungePost(props:any) {
    let profileImage = '/assets/avatarIcon.png';

  return (
    <div>
        <div className="post-container">
			<div className="post">
				<div className="post-avatar-container">
					<img
						className="nav-overlay-img"
						onClick={() => {}}
						src={profileImage}
						alt="avatar Icon"
					/>
				</div>
				<div className="post-content">
					<div>{props.ownerName}</div>
					<div>{props.created_at}</div>
					<div>{props.content}</div>
				</div>
			</div>
			<div className="post-divider"></div>
		</div>
    </div>
  )
}
