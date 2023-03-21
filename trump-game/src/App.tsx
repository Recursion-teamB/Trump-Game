import React, {useEffect} from 'react';
import './App.css';
import game from './phaser';

function App() {
  useEffect(() => {
    game.scene.start('default');
  }, []);
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div id="game"/>
    </div>
  );
}


export default App;
