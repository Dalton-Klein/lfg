import { useNavigate } from "react-router-dom";
import "./profileWidget.scss";
import { useEffect, useState } from "react";

export default function ProfileWidget(props: any) {
  const navigate = useNavigate();
  const [widgetStatus, setwidgetStatus] = useState<any>(<> </>);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (props.value) {
      setwidgetStatus(<i className="pi pi-check-circle" />);
    } else {
      setwidgetStatus(<i className="pi pi-times" />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);
  // ***NEW GAME EDIT
  const widgetPressedEvent = () => {
    switch (props.label) {
      case "gen profile complete?":
        navigate(`/general-profile`);
        break;
      case "rust profile complete?":
        navigate(`/rust-profile`);
        break;
      case "rocket league profile complete?":
        navigate(`/rocket-league-profile`);
        break;
      case "battle bit profile complete?":
        navigate(`/battle-bit-profile`);
        break;
    }
  };
  return (
    <div
      className={props.value ? "profile-widget profile-is-complete" : "profile-widget profile-isnt-complete"}
      onClick={() => {
        widgetPressedEvent();
      }}
      data-tip
      data-tooltip-id={props.tooltipName}
    >
      <div className="widget-value">{widgetStatus}</div>
      <div className="widget-label">{props.label}</div>
    </div>
  );
}
