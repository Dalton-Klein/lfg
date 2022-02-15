import React, { useEffect, useState } from 'react'
import '../../styling/loungePage.scss';
import { howLongAgo, tagsKey } from '../../utils/helperFunctions';

export default function LoungePost(props:any) {
  const defaultPostDate:string = 'just now'
  const [postDate, setPostDate] = useState(defaultPostDate);
  
  let profileImage = '/assets/avatarIcon.png';
  let upvoteImage = '/assets/upvotew.png';
  let downvoteImage = '/assets/downvotew.png';
  
  useEffect(() => {
		setPostDate(howLongAgo(props.created_at));
	}, []);

  let tagsRender = props.tags.map((tag: any) => (
    <div key={tag} className={`post-tag ${tagsKey[tag]}` } >{tag}</div>
	));
  return (
    <div>
      <div className="post-container">
        <div className="post">
          <div className="post-left-column">
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
            <div className="post-info-bar">
              <div className="post-text">{props.owner_name}&nbsp;</div>
              <div className="alt-text"> • {postDate}</div>
            </div>
            <div className="post-info-bar">
              {tagsRender}
            </div>
            <div className="post-text">{props.content}</div>
          </div>
        </div>
        <div className="post-interaction-bar">
          <div className="alt-text">{props.num_comments} comments</div>
        </div>
        <div className="post-divider"></div>
      </div>
    </div>
  )
}
