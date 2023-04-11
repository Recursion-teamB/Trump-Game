import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';
import Phaser from 'phaser';
import { Deck } from '../../model/General/general';
import { BetPopup } from '../../components/BlackJack/BetPopUp';
import { ActionPopup } from '../../components/BlackJack/ActionPopUp';
import ReactDOM from 'react-dom';

export default class BlackGameScene extends Phaser.Scene {
    private playerChipsTexts: Phaser.GameObjects.Text[] = [];
    private playerScoresTexts: Phaser.GameObjects.Text[] = [];
    private betPopupContainer: HTMLElement | null = null;
    private actionPopupContainer: HTMLElement | null = null;
    constructor() {
      super({ key: 'BlackGameScene' });
    }
  
    preload() {
      this.load.image('back', 'assets/back.jpg');
      //this.load.image('help', 'assets/buttons/help.png');
      //this.load.image('back_home', 'assets/buttons/back_home.png');
      const suits = Deck.getSuitList();
      for (let i = 1; i <= 13; i++) {
        suits.forEach(suit => {
          this.load.image(`${suit}${i}`, `assets/card_img/${suit}${i}.png`);
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
      this.scene.launch('BlackGameSceneController');
      this.createHelpAndHomeButtons();
      this.createDeck(screenWidth, screenHeight);
      this.createDealerSection(table, screenWidth / 2, screenHeight / 2);
      this.createPlayerSection(table, screenWidth / 2, screenHeight / 2);

      this.betPopupContainer = document.createElement('div');
      document.body.appendChild(this.betPopupContainer);
      this.actionPopupContainer = document.createElement('div');
      document.body.appendChild(this.actionPopupContainer);
      // this.showBetPopup(table);
      setTimeout(() => {
        this.showBetPopup(table);
      }, 1500);
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
      }
    }
    showBetPopup(table : BlackJackTable) {
      if (!this.betPopupContainer) {
        return;
      }

      ReactDOM.render(
        <BetPopup
          onBet={(betAmount) => {
            this.handleBet(table, betAmount);
            console.log('Bet amount:', betAmount);
            this.hideBetPopup();
          }}
        />,
        this.betPopupContainer
      );
    }

    hideBetPopup() {
      if (this.betPopupContainer) {
        ReactDOM.unmountComponentAtNode(this.betPopupContainer);
      }
    }

    handleBet(table : BlackJackTable, betAmount: number) {
      // BlackJackTableのbetPhaseメソッドを呼び出す
      table.betPhase(betAmount);
      // 表示されているチップを更新
      this.updateChips(table);
      setTimeout(() => {
        table.actionPhase(this);
        // this.showActionPopUp(table);
      }, 3000);
    }
  
    async updateChips(table : BlackJackTable) {
      const numPlayers = table.getPlayers().length;
      console.log("numPlayers", numPlayers);
      for (let i = 0; i < numPlayers; i++) {
        const player = table.getPlayers()[i];
        console.log(player.getName(), player.getChips());
        this.playerChipsTexts[i].setText(`$${player.getChips()}`);
        console.log("playerChipsTexts", this.playerChipsTexts[i]);
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    showActionPopUp (table : BlackJackTable,){
      if (!this.actionPopupContainer ) {
        return;
      }
      if(table.getPlayers()[table.getTurnNumber()].calcScore() >= 21){
        //最初から21以上の場合は非表示
        return;
      }

      ReactDOM.render(
        <ActionPopup
        onHit={() => {
          console.log('Hit');
          this.handleHitAction(table);
          this.hideActionPopUp(table);
        }}
        onStand={() => {
          console.log('Stand');
          table.getPlayers()[table.getTurnNumber()].stand();
          this.hideActionPopUp(table);
        }}
        onDouble={() => {
          console.log('Double');
          this.handledoubleAction(table);
          this.hideActionPopUp(table);
        }}
        onSurrender={() => {
          console.log('Surrender');
          this.handleSurrenderAction(table);
          this.hideActionPopUp(table);
        }}
        />,
        this.actionPopupContainer
      );
    }
    handleHitAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      player.hit(table.getDeck());
      this.updatePlayerScore(turnNumber, player);
    }
    handledoubleAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      const betAmount = player.getCost();
      player.double(table.getDeck(), betAmount);
      console.log('カードの枚数' + player.getHand().length);
      this.updatePlayerScore(turnNumber, player);
    }
    handleSurrenderAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      player.surrender();
      this.updateChipSurrender(turnNumber, player);
    }
    updatePlayerScore(turnNumber : number, player : BlackJackPlayer) {
      this.playerScoresTexts[turnNumber].setText(`Score : ${player.calcScore()}`);
    }
    updateChipSurrender(turnNumber : number, player : BlackJackPlayer) {
      this.playerChipsTexts[turnNumber].setText(`$${player.getChips()}`);
    }
    hideActionPopUp(table : BlackJackTable) {
      //to do scoreが21の時非表示にできなくなるのを解消したい
      const player = table.getPlayers()[table.getTurnNumber()];
      if(this.actionPopupContainer && (player.getAction() !== 'hit' && player.getAction() !== '')){
        ReactDOM.unmountComponentAtNode(this.actionPopupContainer);
        //アクションが終わったらターンを次のプレイヤーに移す
        table.setTurnNumber(table.getTurnNumber() + 1);
      }
    }
}