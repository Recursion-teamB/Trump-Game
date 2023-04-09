import React from 'react';

interface BetPopupProps {
  onBet: (betAmount: number) => void;
}

export const BetPopup: React.FC<BetPopupProps> = ({ onBet }) => {
  const [betAmount, setBetAmount] = React.useState(0);

  const handleBetButtonClick = () => {
    onBet(betAmount);
  };

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
      }}
    >
      <input
        className='bet-input'
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(parseInt(e.target.value))}
      />
      <button onClick={handleBetButtonClick}>Bet</button>
    </div>
  );
};
