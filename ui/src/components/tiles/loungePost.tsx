import React, { useEffect, useState } from 'react'
import '../../styling/loungePage.scss';
import { howLongAgo } from '../../utils/helperFunctions';
import moment from 'moment'

export default function LoungePost(props:any) {
    const defaultPostDate:string = 'just now'
    const [postDate, setPostDate] = useState(defaultPostDate);
    
    let profileImage = '/assets/avatarIcon.png';
    let upvoteImage = '/assets/upvotewhite.png';
    let downvoteImage = '/assets/downvotewhite.png';
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
          <div className="vote-box">
                    <img
                        className="nav-overlay-img"
                        onClick={() => {}}
                        src={upvoteImage}
                        alt="avatar Icon"
                    />
                    <div>{props.num_votes}</div>
                    <img
                        className="nav-overlay-img"
                        onClick={() => {}}
                        src={downvoteImage}
                        alt="avatar Icon"
                    />
                </div>
				</div>
				<div className="post-content">
					<div>{props.ownerName}</div>
					<div>{postDate}</div>
					<div>{props.content}</div>
				</div>
			</div>
            <div className="post-interaction-bar">
                
                <div> {props.num_comments} comments</div>
            </div>
			<div className="post-divider"></div>
		</div>
    </div>
  )
}
