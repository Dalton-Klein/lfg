import './endorsementTile.scss';

type Props = {
  title: string;
  value: number;
};

export default function EndorsementTile(props: Props) {
  return (
    // <article className="tile-box" style={{ backgroundImage: `url(${props.imageLink})` }}>
    <div className="endorsement-box" onClick={() => {}}>
      <div className="endorsement-value">
        {props.value > 0 ? '+' : ''}
        {props.value}
      </div>
      <h3 className="endorsement-title">{props.title}</h3>
    </div>
  );
}
