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

  const widgetPressedEvent = () => {
    switch (props.label) {
      case "gen profile completed?":
        navigate(`/general-profile`);
        break;
      case "rust profile completed?":
        navigate(`/rust-profile`);
        break;
      case "r.l. profile completed?":
        navigate(`/rocket-league-profile`);
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
