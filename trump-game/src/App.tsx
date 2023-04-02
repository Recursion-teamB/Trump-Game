import React, { useEffect, useState } from 'react';
import './App.css';
import { BlackJackTable } from './blackjack';
import './Select-level-screen.css';
//import game from './phaser';


function App() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleClick = () => {
    setIsButtonClicked(true);
  };

  return (
    <div className="App">
      <header className="App-header">
      {!isButtonClicked && (
        <div className=''>
            <div id="lobby" style={{ backgroundColor: '#008000', padding: '10px' }} className="bg-warning ">
              <h2 style={{ color: '#ffffff' }}>Game Lobby</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button style={{ padding: '10px', margin: '10px' }} onClick={handleClick}>Black Jack</button>
              </div>
              <img src={process.env.PUBLIC_URL + '/card_img/s1.png'} alt='' style={{ width: '250px', height: '400px'}}></img>
            </div>
        </div>
      )}
      </header>
      <div id="game" />
    </div>
  );
}


type State = {
  value: number;
};

const SelectLevelScreen = () => {
  const [state, setState] = useState<State>({ value: 3 });
  const [selectedLevel, setSelectedLevel] = useState<string>("normal");

  const handleIncrement = () => {
    if(state.value < 6){
      setState({ value: state.value + 1 });
    }
  };

  const handleDecrement = () => {
    if(state.value > 1){
      setState({ value: state.value - 1 });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setSelectedLevel(e.target.value);
  };

  const handleStartClick = () => {
    console.log("Level: " + selectedLevel)
    console.log("AI: " + state.value);
  };
  const handleQuitClick = () => {
    console.log("quit")
  }
  const handleTutorialClick = () => {
    console.log("tutorial")
  }


  return (
    <div className="bj-sel-background d-flex justify-content-center align-items-center">
      <div className="bj-sel-select-scleen border border-dark border-5 rounded-3 d-flex flex-column align-items-center justify-content-around">
        <h1 className="text-center">Brack Jack</h1>
        <div className="d-flex justify-content-between col-10 h-50">
          <div className="col-3">
            <label className='d-flex justify-content-between'>
              Level:
              <select id="level-sel" value={selectedLevel} onChange={handleSelectChange}>
                <option value="easy">easy</option>
                <option value="normal">normal</option>
                <option value="hard">hard</option>
              </select>
            </label>
            <div>
              <label className='d-flex justify-content-between'>
                Number of AI:
                <div className='d-flex justify-content-around'>
                <button onClick={handleDecrement}>-</button>
                <input className='text-center' min={1} max={6} type="number" value={state.value} onChange={(e) => setState({ value: Number(e.target.value) })} readOnly/>
                <button onClick={handleIncrement}>+</button>
                </div>
              </label>
              
            </div>
          </div>
          <div className="bj-sel-description-box col-8">
            <span className="bj-sel-box-title">ルール紹介</span>
            <p>
              ブラックジャックでは、カードの合計値が21となるような手札を持つこと、
              またはその制限を超えない範囲でできるだけそれに近い手札を持つことが目標とされます。
              ディーラーと対戦し、21に近づけるためにもう1枚カードをもらう（ヒット）か、
              持っているカードをそのままにする（スタンド）かのどちらかを選択します。
              21を超えない範囲で最も高い手札の価値を持つプレイヤーがゲームに勝利します。
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-around col-12">
          <button 
            onClick={handleQuitClick}
            className="d-flex justify-content-center align-items-center btn btn-outline-dark rounded-pill col-3">
            quit
          </button>
          <button 
            onClick={handleStartClick}
            className="d-flex justify-content-center align-items-center btn btn-outline-dark rounded-pill col-3">
            start
          </button>
          <button 
            onClick={handleTutorialClick}
            className="d-flex justify-content-center align-items-center btn btn-outline-dark rounded-pill col-3">
            tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
export {App, SelectLevelScreen};



