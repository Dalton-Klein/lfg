import React, { useState } from 'react';
import './joinGangPage.scss';
import { useNavigate } from 'react-router-dom';

export default function JoinGangPage() {
  const navigate = useNavigate();

  const [joinCodeText, setjoinCodeText] = useState<string>('');
  const [hasCompletedForm, sethasCompletedForm] = useState<boolean>(false);

  const returnHome = () => {
    navigate('/lfm-rust');
  };

  const checkIfFormComplete = () => {
    if (joinCodeText && joinCodeText.length >= 3) {
      sethasCompletedForm(true);
    } else {
      sethasCompletedForm(false);
    }
    return;
  };

  const tryGangInviteCode = () => {};

  return (
    <div className='join-gang-container'>
      <h1 className='join-gang-text'>join a gang in two ways</h1>
      <button className='join-gang-return-button' onClick={returnHome}>
        browse lfm
      </button>
      <div className='info-text'>or, join a gang via invite code</div>
      <input
        onChange={(event) => {
          setjoinCodeText(event.target.value);
          checkIfFormComplete();
        }}
        value={joinCodeText ? joinCodeText : ''}
        type='text'
        className='input-box'
        placeholder={'...invite code'}
      ></input>
      <button className='join-gang-return-button' onClick={tryGangInviteCode}>
        join
      </button>
    </div>
  );
}
