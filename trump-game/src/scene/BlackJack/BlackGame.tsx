import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';
import Phaser from 'phaser';
import { Deck } from '../../model/General/general';
import { BetPopup } from '../../components/BlackJack/BetPopUp';
import { ActionPopup } from '../../components/BlackJack/ActionPopUp';
import { HelpPopup } from '../../components/BlackJack/HelpPopUp';

import ReactDOM from 'react-dom';

export default class BlackGameScene extends Phaser.Scene {
    private playerChipsTexts: Phaser.GameObjects.Text[] = [];
    private playerScoresTexts: Phaser.GameObjects.Text[] = [];
    private playerActionTexts: Phaser.GameObjects.Text[] = [];
    private betPopupContainer: HTMLElement | null = null;
    private actionPopupContainer: HTMLElement | null = null;
    private helpPopupContainer: HTMLElement | null = null;
    private player: BlackJackPlayer = new BlackJackPlayer("You", "Player");
    private table: BlackJackTable = new BlackJackTable(this.player);
    constructor() {
      super({ key: 'BlackGameScene' });
    }

    preload() {
      this.load.image('back', 'assets/back.jpg');
      this.load.image('help', 'assets/help-icon.png');
      //this.load.image('back_home', 'assets/buttons/back_home.png');
      const suits = Deck.getSuitList();
      for (let i = 1; i <= 13; i++) {
        suits.forEach(suit => {
          this.load.image(`${suit}${i}`, `assets/card_img/${suit}${i}.png`);
        });
      }
    }

    create() {
      // Phaserの設定
      const screenWidth = this.cameras.main.width;
      const screenHeight = this.cameras.main.height;
      this.cameras.main.setBackgroundColor(0x008800);
      this.scene.launch('BlackGameSceneController');
      this.createHelpAndHomeButtons();
      this.createDeck(screenWidth, screenHeight);
      this.createDealerSection(this.table, screenWidth / 2, screenHeight / 2);
      this.createPlayerSection(this.table, screenWidth / 2, screenHeight / 2);

      // betとactionのポップアップの箱を追加
      this.betPopupContainer = document.createElement('div');
      document.body.appendChild(this.betPopupContainer);
      this.actionPopupContainer = document.createElement('div');
      document.body.appendChild(this.actionPopupContainer);

      // helpポップアップの箱を追加
      this.helpPopupContainer = document.createElement('div');
      document.body.appendChild(this.helpPopupContainer);


      // 初期挙動の開始
      this.showBetPopup(this.table);
    }

    // helpボタンとbackHomeボタンの追加と設定
    createHelpAndHomeButtons() {
      const maxScale : number = 70;
      const helpButton = this.add.image(50, 50, 'help').setInteractive();
      if(Math.max(helpButton.width, helpButton.height) > maxScale){
        let scale = maxScale / Math.max(helpButton.width, helpButton.height)
        helpButton.setScale(scale);
      }
      helpButton.on('pointerdown', () => {
        this.showHelpPopup();
      })
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
    
        const playerText = this.add.text(playerX, screenHeight + screenHeight * 0.3 * 2.2, `player : ${player.getName()}`, {
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

        const playerAction = this.add.text(playerX, screenHeight + screenHeight * 0.3 * 1.9, `${player.getAction()}`, {
          fontFamily: 'Arial',
          fontSize: '20px'
        });
        this.playerChipsTexts[i] = playerChip;
        this.playerScoresTexts[i] = playerScore;
        this.playerActionTexts[i] = playerAction;
      }
    }

    showHelpPopup() {
      if (!this.helpPopupContainer) {
        return;
      }
      ReactDOM.render(
        <HelpPopup
          onClose={() => {
            this.hideHelpPopup();
          }}
        />,
        this.helpPopupContainer
      );
    }

    hideHelpPopup() {
      if (this.helpPopupContainer) {
        ReactDOM.unmountComponentAtNode(this.helpPopupContainer);
      }
    }

    showBetPopup(table : BlackJackTable) {
      if (!this.betPopupContainer) {
        return;
      }

      ReactDOM.render(
        <BetPopup
          playerChips={table.getPlayers()[0].getChips()}
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
      this.table.betPhase(this, betAmount);
      this.updateChips(table);

      // 次の人のターン
      this.table.betPhase(this, 0);
    }

    async updateChips(table : BlackJackTable) {
      const numPlayers = table.getPlayers().length;
      // console.log("numPlayers", numPlayers);
      for (let i = 0; i < numPlayers; i++) {
        const player = table.getPlayers()[i];
        // console.log(player.getName(), player.getChips());
        this.playerChipsTexts[i].setText(`$${player.getChips()}`);
        // console.log("playerChipsTexts", this.playerChipsTexts[i]);
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    showActionPopUp (table : BlackJackTable,){
      if (!this.actionPopupContainer ) {
        return;
      }
      if(table.getPlayers()[table.getTurnNumber()].calcScore() >= 21){
        //最初から21以上の場合は非表示
        table.actionPhase(this);
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

    // hitボタンの後の処理
    handleHitAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      player.hit(table.getDeck());
      this.updatePlayerScore(turnNumber, player);
    }

    // doubleボタンの後の処理
    handledoubleAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      const betAmount = player.getCost();
      player.double(table.getDeck(), betAmount);
      console.log('カードの枚数' + player.getHand().length);
      this.updatePlayerScore(turnNumber, player);
    }

    // surrenderボタンの後の処理
    handleSurrenderAction(table : BlackJackTable) {
      const turnNumber = table.getTurnNumber();
      const player = table.getPlayers()[turnNumber];
      player.surrender();
      this.updateChipSurrender(turnNumber, player);
    }

    // 表示されているプレイヤーのスコアを書き換える
    updatePlayerScore(turnNumber : number, player : BlackJackPlayer) {
      this.playerScoresTexts[turnNumber].setText(`Score : ${player.calcScore()}`);
    }

    // 表示されているプレイヤーのアクション状態を書き換える
    updatePlayerAction(turnNumber : number, player : BlackJackPlayer) {
      this.playerActionTexts[turnNumber].setText(`${player.getAction()}`);
    }

    // surrenderしたときのchipを書き換える
    updateChipSurrender(turnNumber : number, player : BlackJackPlayer) {
      this.playerChipsTexts[turnNumber].setText(`$${player.getChips()}`);
    }

    // actionPopupを消す
    async hideActionPopUp(table : BlackJackTable) : Promise<void> {
      this.updatePlayerAction(table.getTurnNumber(), table.getPlayers()[table.getTurnNumber()]);
      //to do scoreが21の時非表示にできなくなるのを解消したい
      // const player = table.getPlayers()[table.getTurnNumber()];
      if(this.actionPopupContainer){
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1000)),
          table.changeTurnNumber(),
          ReactDOM.unmountComponentAtNode(this.actionPopupContainer),
        ])
        table.actionPhase(this);
      }
    }
}