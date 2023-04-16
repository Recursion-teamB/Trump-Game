import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './phaser.ts';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);






// 以下もともと書いてあったもの

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import Lobby from './Lobby';
// import reportWebVitals from './reportWebVitals';
// import { SelectLevelScreen } from './App';
// import {StartBlackJackScreen} from './blackjackView'
// import { GameContainer } from './phaser';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <Lobby />
//     <SelectLevelScreen/>
//     <StartBlackJackScreen/>
//     <GameContainer/>
//   </React.StrictMode>
// );
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
