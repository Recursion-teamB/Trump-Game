import React from 'react';
import '../style/BJButton.css'

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
      right: '0%',
      // left: '25%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0)',
      // border: '2px solid #000000',
      // borderRadius: '10px',
    }}
    >
      <button className='button' style={{opacity: '1'}} onClick={onHit} id='action-hit'>Hit</button>
      <button className='button' style={{opacity: '1'}} onClick={onStand} id='action-stand'>Stand</button>
      <button className='button' style={{opacity: '1'}} onClick={onDouble} id='action-double'>Double</button>
      <button className='button' style={{opacity: '1'}} onClick={onSurrender} id='action-surrender'>Surrender</button>
    </div>
  );
};