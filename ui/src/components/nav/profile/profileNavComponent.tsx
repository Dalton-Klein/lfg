import "./profileNavComponent.scss";

type Props = {
  selection: number;
  selectionChanged: (value: number) => void;
};
export default function ProfileNavComponent(props: Props) {
  // const returnHome = () => {
  //   navigate("/");
  // };

  return (
    <div className="nav-container">
      <div
        className="nav-item"
        onClick={() => {
          props.selectionChanged(1);
        }}
      >
        <div className="nav-label">my profile</div>
        {props.selection === 1 ? <div className="nav-indicator"></div> : <></>}
      </div>
      <div
        className="nav-item"
        onClick={() => {
          props.selectionChanged(2);
        }}
      >
        <div className="nav-label">connections</div>
        {props.selection === 2 ? <div className="nav-indicator"></div> : <></>}
      </div>
      <div
        className="nav-item"
        onClick={() => {
          props.selectionChanged(3);
        }}
      >
        <div className="nav-label">pending</div>
        {props.selection === 3 ? <div className="nav-indicator"></div> : <></>}
      </div>
    </div>
  );
}
