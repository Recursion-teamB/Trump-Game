import React from 'react';

interface ActionPopupProps {
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSurrender: () => void;
}

export const ActionPopup: React.FC<ActionPopupProps> = ({
  onHit,
  onStand,
  onDouble,
  onSurrender,
}) => {
  return (
    <div
    style={{
      position: 'absolute',
      width: '50%',
      height: '50%',
      top: '0',
      left: '25%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      border: '2px solid #000000',
      borderRadius: '10px',
      marginTop:'4rem',
    }}
    >
      <button onClick={onHit} id='action-hit'>Hit</button>
      <button onClick={onStand} id='action-stand'>Stand</button>
      <button onClick={onDouble} id='action-double'>Double</button>
      <button onClick={onSurrender} id='action-surrender'>Surrender</button>
    </div>
  );
};