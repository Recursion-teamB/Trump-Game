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
    <div>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(parseInt(e.target.value))}
      />
      <button onClick={handleBetButtonClick}>Bet</button>
    </div>
  );
};