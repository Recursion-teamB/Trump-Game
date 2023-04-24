import React from 'react';
import '../../style/BJButton.css';

interface ResultPopupProps {
  text: string;
  restart: () => void;
  quit: () => void;
}

export const ResultPopup: React.FC<ResultPopupProps> = ({ text, restart, quit }) => {
    return (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0)',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            color: '#000000',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          {text}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button className='button' onClick={restart} id='action-hit' style={{ marginRight: '2.5rem' }}>
            restart
          </button>
          <button className='button' onClick={quit} id='action-stand'>
            quit
          </button>
        </div>
      </div>
    );
  };