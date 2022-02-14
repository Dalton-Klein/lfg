import React, { useEffect, useState } from 'react'
import '../../styling/loungePage.scss';
import { howLongAgo } from '../../utils/helperFunctions';
import moment from 'moment'

export default function LoungePost(props:any) {
    const defaultPostDate:string = 'just now'
    const [postDate, setPostDate] = useState(defaultPostDate);
    
    let profileImage = '/assets/avatarIcon.png';
    useEffect(() => {
		setPostDate(howLongAgo(props.created_at));
	}, []);
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
					<div>{postDate}</div>
					<div>{props.content}</div>
				</div>
			</div>
			<div className="post-divider"></div>
		</div>
    </div>
  )
}
