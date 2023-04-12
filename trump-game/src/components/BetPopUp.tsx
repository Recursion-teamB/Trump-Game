import React from 'react';

interface BetPopupProps {
  onBet: (betAmount: number) => void;
  playerChips: number;
}

export const BetPopup: React.FC<BetPopupProps> = ({ onBet, playerChips}) => {
  const [betAmount, setBetAmount] = React.useState(0);
  const [err, setBettingValidation] = React.useState('');

  const handleBetButtonClick = () => {
      if(betAmount > 0 && betAmount <= playerChips){
      onBet(betAmount);
      }
      else if (betAmount > playerChips){
        setBettingValidation('Not enough chips');
      }
      else {
        setBettingValidation('Betting amount is less than 0');
      }
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
        background: '#301934', 
        border: '2px solid #000000',
        borderRadius: '10px',
        marginTop:'4rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '50%',
        }}
      >
        <input
          className='bet-input'
          type='number'
          value={betAmount}
          onChange={(e) => {
            setBetAmount(parseInt(e.target.value));
            setBettingValidation('');
          }}
          style={{
            flexGrow: 1,
            fontSize: '16px',
            padding: '8px',
            border: '1px solid #000000',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleBetButtonClick}
          style={{
            backgroundColor: '#8A0303',
            color: 'white',
            fontSize: '16px',
            padding: '8px 12px',
            border: '1px solid #000000',
          }}
        >
          Bet
        </button>
      </div>
      {err && (
        <div
          style={{
            color: 'red',
            marginTop: '8px',
            fontSize: '14px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {err}
        </div>
      )}
    </div>
  );
};
