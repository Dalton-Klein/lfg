import FooterComponent from "../nav/footerComponent";
import "./supportPage.scss";
import BannerTitle from "../nav/banner-title";
import React, { useEffect, useRef, useState } from "react";
import BlogTile from "./blog/blogTile";
import { SelectButton } from "primereact/selectbutton";
import SelectComponent from "../myProfile/selectComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { createTicket, getMyTickets, getTicketDetails } from "../../utils/rest";
import moment from "moment";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";

const navOptions: string[] = ["my tickets", "create ticket"];
const supportOptions: any = [
  { value: 1, label: "leave feedback", id: "1", type: "ticket" },
  { value: 2, label: "report bug", id: "2", type: "ticket" },
  { value: 3, label: "report harassment", id: "3", type: "ticket" },
  { value: 4, label: "report innapropriate content", id: "4", type: "ticket" },
  { value: 5, label: "ask for help", id: "5", type: "ticket" },
];
const supportTitles: any = {
  1: "feedback submission",
  2: "bug flagged",
  3: "harrassment flagged",
  4: "innapropriate content flagged",
  5: "request for help",
};
const supportStatusKey: any = {
  1: "opened",
  2: "support in progress",
  3: "resolved",
  4: "closed due to inactivity",
};
export default function SupportPage() {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const userData = useSelector((state: RootState) => state.user.user);
  const ticketSelectRef: any = useRef([{ current: { value: 0, label: "blank", id: "0", type: "ticket" } }]);
  const toast: any = useRef({ current: "" });

  const [ticketObjects, setticketObjects] = useState<any>([]);
  const [historicalTickets, sethistoricalTickets] = useState<any>([]);
  const [ticketReplies, setticketReplies] = useState<any>([]);
  const [value, setvalue] = useState<string>(navOptions[0]);
  const [supportSelection, setsupportSelection] = useState<any>(supportOptions[0]);
  const [description, setdescription] = useState<string>("");
  const [selectedTicket, setselectedTicket] = useState<any>({});

  useEffect(() => {
    if (userData.id && userData.id > 0) {
      getTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locationPath.substring(0, 15) === "/support-ticket") {
      setselectedTicket(ticketObjects.find((t: { id: number }) => t.id === parseInt(locationPath.substring(16, 80))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketObjects]);

  useEffect(() => {
    if (locationPath.substring(0, 15) === "/support-ticket") {
      setselectedTicket(ticketObjects.find((t: { id: number }) => t.id === parseInt(locationPath.substring(16, 80))));
      fetchTicketDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket]);

  const toggleNav = (e: any) => {
    setvalue(e.value);
  };

  const getTickets = async () => {
    const ticketResult = await getMyTickets(userData.id, "");
    setticketObjects(ticketResult);
    if (ticketResult && ticketResult.length) {
      let formattedTickets: any = [];
      ticketResult.forEach((ticket: any) => {
        formattedTickets.push(
          <BlogTile
            routerLink={`/support-ticket/${ticket.id}`}
            title={`${supportTitles[ticket.type_id]} | id: ${ticket.id}`}
            updated_on={`${moment(ticket.updated_at).format("MM-DD-YYYY h:mmA")}  |  status: ${
              supportStatusKey[ticket.status]
            } `}
            preview={`${ticket.description.substring(0, 50)}...`}
            key={ticket.id}
          ></BlogTile>
        );
      });
      sethistoricalTickets(formattedTickets);
    }
  };

  const fetchTicketDetails = async () => {
    const result = await getTicketDetails(parseInt(locationPath.substring(16, 80)), "");
    setticketReplies(result);
  };

  const changeTicketType = (selection: any) => {
    ticketSelectRef.current.detectChangeFromParent(selection);
    setsupportSelection(supportOptions.find(({ value }) => value === selection.value));
    return;
  };

  const tryOpenTicket = async () => {
    const ticketResult = await createTicket(userData.id, supportSelection.value, description, "");
    getTickets();
    if (ticketResult.data) {
      setdescription("");
      toggleNav({ value: "my tickets" });
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "ticket created!",
        detail: ``,
        sticky: false,
      });
    }
  };

  const goToSupportHome = async () => {
    navigate(`/support`);
  };

  return (
    <div className="support-master">
      <Toast ref={toast} />
      <div className="support-master-container">
        <BannerTitle
          title={"support & feedback"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* View All Tickets */}
        {locationPath.substring(0, 15) === "/support-ticket" && selectedTicket && selectedTicket.id ? (
          <div className="ticket-detail-container">
            <button
              onClick={() => {
                goToSupportHome();
              }}
            >
              support home
            </button>
            <div className="ticket-detail-title">ticket details</div>
            <div className="ticket-details">
              <div className="ticket-detail-box">
                <div className="ticket-detail">id </div>
                <div className="ticket-detail">{selectedTicket.id}</div>
              </div>
              <div className="ticket-detail-box">
                <div className="ticket-detail">type </div>
                <div className="ticket-detail">"{supportTitles[selectedTicket.type_id]}"</div>
              </div>
              <div className="ticket-detail-box">
                <div className="ticket-detail">description </div>
                <div className="ticket-detail">{selectedTicket.description}</div>
              </div>
              <div className="ticket-detail-box">
                <div className="ticket-detail">status </div>
                <div className="ticket-detail">{supportStatusKey[selectedTicket.status]}</div>
              </div>
            </div>
            <div className="ticket-detail-title">ticket conversation</div>
            {ticketReplies && ticketReplies.length ? <div></div> : <div>no replies from support yet!</div>}
          </div>
        ) : (
          <div className="support-content-container">
            <SelectButton value={value} onChange={(e) => toggleNav(e)} options={navOptions} />
            {value === "my tickets" ? (
              historicalTickets.length ? (
                historicalTickets
              ) : (
                <div className="no-tickets-notifier"> no open tickets</div>
              )
            ) : (
              <div className="create-ticket-container">
                <div className="ticket-help-text">
                  When creating a ticket, make sure to be as descriptive as possible.
                </div>
                <div className="ticket-help-text">
                  Let us know what page it happened on, what you expected to happen, and any additional details that
                  will help us resolve your issue!
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
        )}
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
