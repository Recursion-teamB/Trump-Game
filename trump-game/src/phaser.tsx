import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { BlackJackPlayer, BlackJackTable } from './blackjack';
import { Deck } from './general';

export class MainScene extends Phaser.Scene {
    private playerChipsTexts: Phaser.GameObjects.Text[] = [];
    private playerScoresTexts: Phaser.GameObjects.Text[] = [];
    constructor() {
      super({ key: 'MainScene' });
    }
  
    preload() {
      this.load.image('back', 'assets/back.jpg');
      //this.load.image('help', 'assets/buttons/help.png');
      //this.load.image('back_home', 'assets/buttons/back_home.png');
      const suits = Deck.getSuitList();
      for (let i = 1; i <= 13; i++) {
        suits.forEach(suit => {
          this.load.image(`${suit}${i}`, `card_img/${suit}${i}.png`);
        });
      }
    }
  
    create() {
      let player: BlackJackPlayer = new BlackJackPlayer("Player", "Player");
      let table: BlackJackTable = new BlackJackTable(player);
      table.distributeCards();
      const screenWidth = this.cameras.main.width;
      const screenHeight = this.cameras.main.height;
      this.cameras.main.setBackgroundColor(0x008800);
      this.scene.launch('MainSceneController');
      this.createHelpAndHomeButtons();
      this.createDeck(screenWidth, screenHeight);
      this.createDealerSection(table, screenWidth / 2, screenHeight / 2);
      this.createPlayerSection(table, screenWidth / 2, screenHeight / 2);
      this.drawScreen(this.cameras.main.width, this.cameras.main.height, table, ['Bet'], 3000);
    }
    createHelpAndHomeButtons() {
      const helpButton = this.add.image(50, 50, 'help').setInteractive();
      const backHomeButton = this.add.image(150, 50, 'back_home').setInteractive();
    }
    createDeck(screenWidth: number, screenHeight: number) {
      const deckWidth = screenWidth * 0.06;
      const deckHeight = screenHeight * 0.15;
      const deck = this.add.image(screenWidth / 2, screenHeight / 2 , 'back');
      deck.setDisplaySize(deckWidth, deckHeight);
    }
    createDealerSection(table: BlackJackTable, screenWidth: number, screenHeight: number) {
      const dealerCards = table.getHouse().getHand();
      dealerCards.forEach((card, index) => {
        const dealerCard = card.createPhaserImg(this, screenWidth - 0.5 * screenWidth * 0.06 + (index * screenWidth * 0.06 * 0.8), screenHeight - screenHeight * 0.3 * 1.5);
        dealerCard.setDisplaySize(screenWidth * 0.12, screenHeight * 0.3);
      });
      const dealerText = this.add.text(screenWidth - screenWidth * 0.06, screenHeight - screenHeight * 0.3 * 2.5, 'dealer', {
        fontFamily: 'Arial',
        fontSize: '20px'
      });
    }
    createPlayerSection(table: BlackJackTable, screenWidth: number, screenHeight: number) {
      const numPlayers = table.getPlayers().length;
      const spaceBetweenPlayers = screenWidth / (numPlayers + 1);
      for (let i = 0; i < numPlayers; i++) {
        const player = table.getPlayers()[i];
        const playerCards = player.getHand();
        const playerX = (i + 1) * spaceBetweenPlayers;
    
        playerCards.forEach((card, index) => {
          let playerCard = card.createPhaserImg(this, playerX + (index * screenWidth * 0.06 * 0.8), screenHeight + screenHeight * 0.3 * 1.5);
          playerCard.setDisplaySize(screenWidth * 0.12, screenHeight * 0.3);
        });
    
        const playerText = this.add.text(playerX, screenHeight + screenHeight * 0.3 * 2.2, `player : ${player.getType()}`, {
          fontFamily: 'Arial',
          fontSize: '20px'
        });
        const playerChip = this.add.text(playerX, screenHeight + screenHeight * 0.3 * 2.5, `$${player.getChips()}`, {
          fontFamily: 'Arial',
          fontSize: '20px'
        });

        const playerScore = this.add.text(playerX, screenHeight + screenHeight * 0.3 * 2.8, `Score : ${player.calcScore()}`, {
          fontFamily: 'Arial',
          fontSize: '20px'
        });
        this.playerChipsTexts[i] = playerChip;
        this.playerScoresTexts[i] = playerScore;
        this.updatePlayerCards(table);
        this.updatePlayerScore(table);
      }
      
    }

    drawScreen(screenWidth: number, screenHeight: number, table: BlackJackTable, texts: string[], delay: number): Phaser.GameObjects.Container {
      const screen = this.add.container(0, 0).setVisible(false);
    
      const background = this.add.graphics();
      background.fillStyle(0x000000, 0.5);
      background.fillRect(0, 0, screenWidth, screenHeight);
      screen.add(background);

      for(let i = 0; i < texts.length; i++) {
        const displayText = this.add.text(screenWidth / 2, screenHeight / 2 + i * 75 - 50, texts[i], {
          fontFamily: 'Arial',
          fontSize: '50px'
        }).setInteractive();
        displayText.setOrigin(0.5);
        screen.add(displayText);
        if (texts[i] === 'Bet') {
          displayText.setInteractive().on('pointerdown', () => {
            (this.scene.get('MainSceneController') as MainSceneController).betController(table, screen);
          });
        } else {
          displayText.setInteractive().on('pointerdown', () => {
            (this.scene.get('MainSceneController') as MainSceneController).actionController(table, screen);
          });
        }
      
      }
    

      this.time.delayedCall(delay, () => {
        screen.setVisible(true);
      });
    
      return screen;
    }

    updatePlayerChips(mainScene: MainScene, table: BlackJackTable) {
      const players = table.getPlayers();
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const chipText = mainScene.playerChipsTexts[i];
        chipText.setText(`$${player.getChips()}`);
      }
    }
    updatePlayerCards(table: BlackJackTable) {
      const players = table.getPlayers();
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerCards = player.getHand();
        playerCards.forEach((card, index) => {
          const screenWidth = this.cameras.main.width;
          const screenHeight = this.cameras.main.height;
          const playerX = (i + 1) * (screenWidth / (players.length + 1));
          let playerCard = card.createPhaserImg(this, playerX + (index * screenWidth * 0.06 * 0.8), screenHeight + screenHeight * 0.3 * 1.5);
          playerCard.setDisplaySize(screenWidth * 0.12, screenHeight * 0.3);
        });
      }
    }  
    updatePlayerScore(table: BlackJackTable) {
      const players = table.getPlayers();
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const score = player.calcScore();
        this.playerScoresTexts[i].setText(`Score : ${score}`);
      }
    } 
}

class MainSceneController extends Phaser.Scene {
  private actionStatus: string;

  constructor() {
    super({ key: 'MainSceneController' });
    this.actionStatus = '';
  }

  create() {}

  startBlackJack() {
    let player: BlackJackPlayer = new BlackJackPlayer("Player", "Player");
    let table: BlackJackTable = new BlackJackTable(player);
    table.distributeCards();
  }

  betController(table: BlackJackTable, screen: Phaser.GameObjects.Container) {
    screen.setVisible(false);
    table.betPhase(100);
    const mainScene = this.scene.get("MainScene") as MainScene;
    mainScene.updatePlayerChips(mainScene, table);

    const newScreen = mainScene.drawScreen(mainScene.cameras.main.width, mainScene.cameras.main.height, table, ['Hit', 'Stand', 'Surrender'], 3000);
    this.addLittenHitButton(mainScene, table, newScreen);
  }

  actionController(table: BlackJackTable, screen: Phaser.GameObjects.Container) {
    screen.setVisible(false);
    const mainScene = this.scene.get("MainScene") as MainScene;
    mainScene.updatePlayerChips(mainScene, table);

    if (this.actionStatus === 'hit' || this.actionStatus === '') {
      const newScreen = mainScene.drawScreen(mainScene.cameras.main.width, mainScene.cameras.main.height, table, ['Hit', 'Stand', 'Surrender'], 3000);
      this.addLittenHitButton(mainScene, table, newScreen);
    }
    else if(this.actionStatus === 'stand') {
      this.addLittenStandButton(mainScene, table, screen);
    }
  }
  
  addLittenHitButton(mainScene: MainScene, table: BlackJackTable, screen: Phaser.GameObjects.Container) {
    const hitText = mainScene.add.text(mainScene.cameras.main.width - mainScene.cameras.main.width * 0.06 / 2, mainScene.cameras.main.height + mainScene.cameras.main.height * 0.15 * 3.5, 'Hit', {
      fontFamily: 'Arial',
      fontSize: '20px'
    });
    hitText.setInteractive().on('pointerdown', () => {
      const player = table.getPlayers()[0]; // Assuming only one player for now
      player.hit(table.getDeck());
      this.actionStatus = 'hit';
      mainScene.updatePlayerCards(table);
      mainScene.updatePlayerScore(table);
      this.actionController(table, screen); // これを追加
    });
  }
  

  // addLittenHitButton(mainScene: MainScene, table: BlackJackTable, screen: Phaser.GameObjects.Container) {
  //   const hitText = screen.getByName('Hit');
  //   hitText.setInteractive().on('pointerdown', () => {
  //     const player = table.getPlayers()[0]; // Assuming only one player for now
  //     player.hit(table.getDeck());
  //     this.actionStatus = 'hit';
  //     mainScene.updatePlayerCards(table);
  //     mainScene.updatePlayerScore(table);
  //   });
  // }


  addLittenStandButton(mainScene: MainScene, table: BlackJackTable, screen: Phaser.GameObjects.Container) {
    const standText = mainScene.add.text(mainScene.cameras.main.width - mainScene.cameras.main.width * 0.06 / 2, mainScene.cameras.main.height + mainScene.cameras.main.height * 0.15 * 5.5, 'Stand', {
      fontFamily: 'Arial',
      fontSize: '20px'
    });   
    standText.setInteractive().on('pointerdown', () => {
      this.actionStatus = 'stand';
      screen.setVisible(false);
    });
  }
}




export const GameContainer: React.FC = () => {
    useEffect(() => {
        const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [MainScene, MainSceneController],
        };

        const game = new Phaser.Game(config);

        return () => {
        game.destroy(true);
        };
    }, []);

    return <div id="phaser-container" />;
};