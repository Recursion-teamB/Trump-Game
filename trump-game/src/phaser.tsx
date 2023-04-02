import React, { useEffect } from 'react';
import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainScene' });
    }
  
    preload() {
      this.load.image('back', './image/back.jpg');
      //this.load.image('help', 'assets/buttons/help.png');
      //this.load.image('back_home', 'assets/buttons/back_home.png');
    }
  
    create() {
      // 背景を緑色に設定
      this.cameras.main.setBackgroundColor(0x008800);
  
      // ヘルプボタンとバックホームボタンを作成
      const helpButton = this.add.image(50, 50, 'help').setInteractive();
      const backHomeButton = this.add.image(150, 50, 'back_home').setInteractive();
  
      // 山札を作成
      const screenWidth = this.cameras.main.width;
      const screenHeight = this.cameras.main.height;
      const deckWidth = screenWidth * 0.04;
      const deckHeight = screenHeight * 0.1;
  
      const deck = this.add.image(screenWidth / 2, screenHeight / 2, 'back');
      deck.setDisplaySize(deckWidth, deckHeight);
  
      // ディーラーの手札とテキストを作成
      const dealerCard = this.add.image(deck.x, deck.y - deckHeight * 3, 'back');
      dealerCard.setDisplaySize(deckWidth, deckHeight);
      const dealerText = this.add.text(deck.x - deckWidth / 2, dealerCard.y - deckHeight * 1.0, 'dealer');
  
      // プレイヤーの手札とテキストを作成
      const numPlayers = 3;
      for (let i = 0; i < numPlayers; i++) {
        const playerCard = this.add.image(deck.x + (i - 1) * deckWidth * 3, deck.y + deckHeight * 3, 'back');
        playerCard.setDisplaySize(deckWidth, deckHeight);
        const playerText = this.add.text(playerCard.x - deckWidth / 2, playerCard.y + deckHeight * 1.0, `player${i + 1}`);
      }
    }
}
  

export const GameContainer: React.FC = () => {
    useEffect(() => {
        const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [MainScene],
        };

        const game = new Phaser.Game(config);

        return () => {
        game.destroy(true);
        };
    }, []);

    return <div id="phaser-container" />;
};