import React, { useEffect, useState } from "react";
import "../../styling/loungePage.scss";
import "../../styling/tagColors.scss";
import { howLongAgo } from "../../utils/helperFunctions";
import "primeicons/primeicons.css";

export default function LoungePost(props: any) {
  console.log("propsss ", props);
  const defaultPostDate: string = "just now";
  const [postDate, setPostDate] = useState(defaultPostDate);

  let profileImage = "/assets/avatarIcon.png";
  let upvoteImage = "/assets/upvotew.png";
  let downvoteImage = "/assets/downvotew.png";
  let editOpen = false;

  useEffect(() => {
    setPostDate(howLongAgo(props.created_at));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = () => {
    editOpen = !editOpen;
  };

  let topicsRender = (
    <div key={props.category} className={`post-topic ${props.category_color}`}>
      {props.category}
    </div>
  );
  // let topicsRender = props.topic_names.map((topic: any, index: number) => (
  //   <div key={topic} className={`post-topic ${props.topic_colors[index]}`}>
  //     {topic}
  //   </div>
  // ));

  return (
    <div>
      <div className="post-container">
        <div className="post">
          <div className="post-left-column">
            <img className="nav-overlay-img" onClick={() => {}} src={profileImage} alt="avatar Icon" />
            <div className="vote-box">
              <img className="nav-overlay-img" onClick={() => {}} src={upvoteImage} alt="avatar Icon" />
              <div>{props.number_votes}</div>
              <img className="nav-overlay-img" onClick={() => {}} src={downvoteImage} alt="avatar Icon" />
            </div>
          </div>
          <div className="post-content">
            <div className="post-title-bar">
              <div className="left">
                <div className="post-text">{props.username}&nbsp;</div>
                <div className="alt-text"> • {postDate}</div>
              </div>
              <div className="right">
                <button onClick={openEdit} className="text-only-button interact-button">
                  <i className="pi pi-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="post-info-bar">{topicsRender}</div>
            <div className="post-text">{props.content}</div>
          </div>
        </div>
        <div className="post-interaction-bar">
          <div className="alt-text">{props.num_comments} comments</div>
        </div>
        <div className="post-divider"></div>
      </div>
    </div>
  );
}
