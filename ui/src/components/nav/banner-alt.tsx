import { useNavigate } from 'react-router-dom';
import './banner-alt.scss';

type Props = {
  title: string;
  buttonText: string;
  buttonLink: string;
  button2Text?: string;
  button2Link?: string;
};

export default function BannerAlt(props: Props) {
  const navigate = useNavigate();
  const buttonPressed = () => {
    navigate(props.buttonLink);
  };
  const button2Pressed = () => {
    if (props.button2Link) navigate(props.button2Link);
  };
  return (
    <div className='alt-banner-box'>
      <h1>{props.title}</h1>
      <div className='button-holder'>
        <button className='text-only-button banner-alt-button' onClick={buttonPressed}>
          {props.buttonText}
        </button>
        <button
          className='text-only-button banner-alt-button'
          onClick={button2Pressed}
          style={{ display: props.button2Link && props.button2Link !== '' ? 'inline' : 'none' }}
        >
          {props.button2Text}
        </button>
      </div>
    </div>
  );
}
