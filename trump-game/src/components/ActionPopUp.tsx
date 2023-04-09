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
    <div>
      <button onClick={onHit}>Hit</button>
      <button onClick={onStand}>Stand</button>
      <button onClick={onDouble}>Double</button>
      <button onClick={onSurrender}>Surrender</button>
    </div>
  );
};