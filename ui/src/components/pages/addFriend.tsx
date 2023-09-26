import FooterComponent from "../nav/footerComponent";
import "./addFriend.scss";
import { useLocation } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { createConnectionRequest, searchUserByUsername } from "../../utils/rest";

export default function AddFriend() {
  const toast: any = useRef({ current: "" });
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const topOfPageRef: any = useRef(null);
  const [usernameSearchText, setusernameSearchText] = useState<string>("");
  const [connectionText, setconnectionText] = useState<string>("");
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToSection(topOfPageRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const trySendInvite = async () => {
    const searchResult = await searchUserByUsername(usernameSearchText, "");
    if (searchResult.data?.id) {
      const inviteResult = await createConnectionRequest(
        userState.id,
        searchResult.data?.id,
        1,
        connectionText,
        "nothing"
      );
      if (inviteResult && inviteResult.status === "success") {
        toast.current?.clear();
        toast.current.show({
          severity: "success",
          summary: "invite sent!",
          detail: ``,
          sticky: false,
        });
        setconnectionText("");
        setusernameSearchText("");
      } else if (inviteResult && inviteResult.status === "error") {
        toast.current?.clear();
        toast.current.show({
          severity: "info",
          summary: `${inviteResult.data}`,
          detail: ``,
          sticky: false,
        });
        setconnectionText("");
        setusernameSearchText("");
      } else if (inviteResult && inviteResult.error) {
        toast.current?.clear();
        toast.current.show({
          severity: "warn",
          summary: `${inviteResult.error}`,
          detail: ``,
          sticky: false,
        });
      } else {
        toast.current?.clear();
        toast.current.show({
          severity: "warn",
          summary: "error sending request!",
          detail: ``,
          sticky: false,
        });
      }
    } else {
      toast.current?.clear();
      toast.current.show({
        severity: "warn",
        summary: "no user exists with that name!",
        detail: ``,
        sticky: false,
      });
    }
  };

  return (
    <div ref={topOfPageRef}>
      <Toast ref={toast} />
      <div className="request-master-container">
        <BannerTitle
          title={"add friend"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* Welcome */}
        <div className="friend-request-container">
          username
          <input
            onChange={(event) => {
              setusernameSearchText(event.target.value);
            }}
            value={usernameSearchText}
            type="text"
            className="search-member-input"
            placeholder={"username must be exact..."}
          ></input>
          message
          <input
            onChange={(event) => {
              setconnectionText(event.target.value);
            }}
            value={connectionText ? connectionText : ""}
            className="input-box"
            placeholder={"write a short message..."}
          ></input>
          <button
            disabled={usernameSearchText.length < 3 || !connectionText.length}
            onClick={trySendInvite}
            className="upload-form-btns"
          >
            send request
          </button>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
