import React, {useState } from 'react';
import './App.css';

function App() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleClick = () => {
    setIsButtonClicked(true);
  };

  return (
    <div className="App">
      <header className="App-header" />
      {!isButtonClicked && (
        <div className=''>
            <div id="lobby" style={{ backgroundColor: '#008000', padding: '10px' }} className="bg-warning ">
              <h2 style={{ color: '#ffffff' }}>Game Lobby</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button style={{ padding: '10px', margin: '10px' }} onClick={handleClick}>Black Jack</button>
              </div>
            </div>
        </div>
      )}
      <div id="game" />
    </div>
  );
}

export default App;



