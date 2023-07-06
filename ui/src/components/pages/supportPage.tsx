import FooterComponent from "../nav/footerComponent";
import "./supportPage.scss";
import BannerTitle from "../nav/banner-title";
import React, { useEffect, useRef, useState } from "react";
import BlogTile from "./blog/blogTile";
import { SelectButton } from "primereact/selectbutton";
import SelectComponent from "../myProfile/selectComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function SupportPage() {
  const userState = useSelector((state: RootState) => state.user.user);
  const navOptions: string[] = ["my tickets", "open ticket"];
  const supportOptions: any = [
    { value: 1, label: "leave feedback", id: "1", type: "ticket" },
    { value: 2, label: "report bug", id: "2", type: "ticket" },
    { value: 3, label: "report harassment", id: "3", type: "ticket" },
    { value: 4, label: "report innapropriate content", id: "4", type: "ticket" },
    { value: 5, label: "ask for help", id: "5", type: "ticket" },
  ];
  const ticketSelectRef: any = useRef([{ current: { value: 0, label: "blank", id: "0", type: "ticket" } }]);

  const [value, setValue] = useState<string>(navOptions[0]);
  const [supportSelection, setsupportSelection] = useState<any>(supportOptions[0]);
  const [description, setdescription] = useState<string>("");

  const toggleNav = (e: any) => {
    setValue(e.value);
  };

  const changeTicketType = (selection: any) => {
    ticketSelectRef.current.detectChangeFromParent(selection);
    setsupportSelection(supportOptions.find(({ value }) => value === selection.value));
    return;
  };

  const tryOpenTicket = async () => {
    // const ticketResult = await searchUserByUsername(userState.id, supportSelection.value, description, "");
    // if (ticketResult.data) {
    // }
  };

  return (
    <div className="support-master">
      <div className="support-master-container">
        <BannerTitle
          title={"support"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* Welcome */}
        <div className="support-content-container">
          <SelectButton value={value} onChange={(e) => toggleNav(e)} options={navOptions} />
          {value === "my tickets" ? (
            <BlogTile
              routerLink="/ticket/1"
              title="bug when adding friend"
              updated_on="07/04/2023"
              preview="We are giving out $20 bundles of in game items of your choosing..."
            ></BlogTile>
          ) : (
            <div className="create-ticket-container">
              <div className="ticket-help-text">
                When creating a ticket, make sure to be as descriptive as possible.
              </div>
              <div className="ticket-help-text">
                Let us know what page it happened on, what you expected to happen, and any additional details that will
                help us resolve your issue!
              </div>
              <div className="ticket-subtitle">ticket type</div>
              <SelectComponent
                publicMethods={ticketSelectRef}
                title="ticket"
                options={supportOptions}
                multi={false}
                setSelection={changeTicketType}
                selection={supportSelection}
              />
              <div className="ticket-subtitle">ticket description</div>
              <textarea
                onChange={(event) => {
                  setdescription(event.target.value);
                }}
                value={description}
                className="search-member-input"
                placeholder={"what do you need assistance with..."}
                rows={4}
                style={{ resize: "none" }}
              ></textarea>
              <button disabled={description.length < 3} onClick={tryOpenTicket} className="upload-form-btns">
                open ticket
              </button>
            </div>
          )}
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
