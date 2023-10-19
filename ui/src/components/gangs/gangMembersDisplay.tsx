import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import moment from "moment";
import "primeflex/primeflex.css";
import "./gangMembersDisplay.scss";

export default function GangMembersDisplay(props) {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const itemTemplate = (member: any) => {
    return (
      <div className="gang-member-row-parent col-12">
        <div className="mssg-avatar-container">
          {member.avatar_url === "" ||
          member.avatar_url ===
            "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
            <div className="dynamic-avatar-border">
              <div className="dynamic-avatar-text-med">
                {member.username
                  .split(" ")
                  .map((word: string[]) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toLowerCase()}
              </div>
            </div>
          ) : (
            <img className="mssg-avatar" onClick={() => {}} src={member.avatar_url} alt={`${member.username}avatar`} />
          )}
        </div>
        <div className="member-name-info">
          <div className="member-name-text">{member.username}</div>
          <div className="member-role-info">
            <i className="pi pi-sitemap"></i>
            <span className="member-role-text">{member.role_name}</span>
          </div>
        </div>
        <div className="member-date-box">
          <div className="member-date-value">{moment(member.member_since_date).format("MMMM Do, YYYY")}</div>
        </div>
        <div className="member-date-box">
          <div className="member-date-value-2">{moment(member.joined_date).format("MMMM Do, YYYY")}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="gang-members-master-box">
      <DataView value={props.gangInfo.basicInfo.members} itemTemplate={itemTemplate} paginator rows={15} />
    </div>
  );
}
