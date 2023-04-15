import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';
import Phaser from 'phaser';
import { Deck } from '../../model/General/general';
import { BetPopup } from '../../components/BlackJack/BetPopUp';
import { ActionPopup } from '../../components/BlackJack/ActionPopUp';
import { HelpPopup } from '../../components/BlackJack/HelpPopUp';
import { Ranking } from '../../components/BlackJack/ranking';
import ReactDOM from 'react-dom';

export default class BlackGameScene extends Phaser.Scene {
    private playerChipsTexts: Phaser.GameObjects.Text[] = [];
    private playerScoresTexts: Phaser.GameObjects.Text[] = [];
    private playerActionTexts: Phaser.GameObjects.Text[] = [];
    private dealerTexts: Phaser.GameObjects.Text[] = [];
    private gameEventPopupContainer : HTMLElement | null = null;
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

    async create() {
      // Phaserの設定
      const screenWidth = this.cameras.main.width;
      const screenHeight = this.cameras.main.height;
      this.cameras.main.setBackgroundColor(0x008800);
      this.scene.launch('BlackGameSceneController');
      this.createHelpAndHomeButtons();
      this.createDeck(screenWidth, screenHeight);
      this.createDealerSection(this.table, screenWidth / 2, screenHeight / 2);
      this.createPlayerSection(this.table, screenWidth / 2, screenHeight / 2);

      // betとactionを表示するためのポップアップの箱を追加
      // betとactionは同時に画面に存在することがないため同じ箱を使いまわす
      this.gameEventPopupContainer = document.createElement('div');
      document.body.appendChild(this.gameEventPopupContainer);

      // helpポップアップの箱を追加
      // helpはbetやactionと同時に使われることがあると想定されるので別の箱を用いる
      this.helpPopupContainer = document.createElement('div');
      document.body.appendChild(this.helpPopupContainer);


      // 初期挙動の開始
      await this.createEventDisplay("Game Start");
      await this.createEventDisplay("Round 1");
      this.showBetPopup(this.table);
    }


    // roundの移行や勝敗の表示などの時に使う
    async createEventDisplay(str : string) : Promise<void> {
      let rectangle = this.add.graphics();
      rectangle.fillStyle(0x000000, 0.7);
      rectangle.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

      // テキストを作成して中央に配置する
      let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, str, {
        font: "60px Arial",
      });
      text.setOrigin(0.5);
      text.setDepth(1);

      await new Promise(resolve => setTimeout(resolve, 2000));
      rectangle.destroy();
      text.destroy();
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
      const dealerScore = this.add.text(screenWidth - screenWidth * 0.06, screenHeight - screenHeight * 0.3 * 2.2, `Score : ${table.getHouse().calcScore()}`, {
        fontFamily: 'Arial',
        fontSize: '20px'
      });

      const dealerAction = this.add.text(screenWidth - screenWidth * 0.06, screenHeight - screenHeight * 0.3 * 1.9, `${table.getHouse().getAction()}`, {
        fontFamily: 'Arial',
        fontSize: '20px'
      })
      this.dealerTexts[0] = dealerText;
      this.dealerTexts[1] = dealerScore;
      this.dealerTexts[2] = dealerAction;
    }

    updateDealerScore(open : boolean){
      let dealer : BlackJackPlayer = this.table.getHouse();
      if(open){
        this.dealerTexts[1].setText(`Score : ${dealer.calcScore()}`);
      }
      else{
        this.dealerTexts[1].setText(`Score : ${dealer.closeCalcScore()}`);
      }
    }

    updateDealerAction(){
      this.dealerTexts[2].setText(`${this.table.getHouse().getAction()}`);
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

    // ゲーム終了時にランキングを表示する関数
    showRankingPopup(ranking : BlackJackPlayer[]) {
      if(!this.gameEventPopupContainer){
        return;
      }

      ReactDOM.render(
        <Ranking
          items={ranking}
          onContinue={() => {
            this.handleContinue();
          }}
          onEnd={() => {
            this.handleEnd();
          }}
        />,
        this.gameEventPopupContainer
      );
    }

    handleContinue(){
      console.log("continue");
    };

    handleEnd(){
      console.log("End");
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
      if (!this.gameEventPopupContainer) {
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
          text='掛け金を入力してください'
        />,
        this.gameEventPopupContainer
      );
    }

    hideBetPopup() {
      if (this.gameEventPopupContainer) {
        ReactDOM.unmountComponentAtNode(this.gameEventPopupContainer);
      }
    }

    handleBet(table : BlackJackTable, betAmount: number) {
      // 表示されているチップを更新
      this.table.betPhase(this, betAmount);
      this.updateChips(table);
      // 次の人のターン
      this.table.betPhase(this, 0);
    }

    updateChip(turnNumber : number, player : BlackJackPlayer){
      this.playerChipsTexts[turnNumber].setText(`$${player.getChips()}`);
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
      if (!this.gameEventPopupContainer ) {
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
          this.hideEventPopUp();
          this.showDoubleBetPopup(this.table);
        }}
        onSurrender={() => {
          console.log('Surrender');
          this.handleSurrenderAction(table);
          this.hideActionPopUp(table);
        }}
        />,
        this.gameEventPopupContainer
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
      console.log('カードの枚数' + player.getHand().length);
      this.updatePlayerScore(turnNumber, player);
      this.updateChip(turnNumber, player);
    }

    showDoubleBetPopup(table : BlackJackTable) {
      const player = table.getPlayers()[table.getTurnNumber()];
      if (!this.gameEventPopupContainer) {
        return;
      }

      ReactDOM.render(
        <BetPopup
          playerChips={player.getCost()}
          onBet={(betAmount) => {
            player.double(table.getDeck(), betAmount);
            this.handledoubleAction(table);
            this.hideActionPopUp(table);
          }}
          text='追加の掛け金を入力してください。すでにかけた金額と同額まで追加で掛けることができます'
        />,
        this.gameEventPopupContainer
      );
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

    hideEventPopUp() : void {
      if(this.gameEventPopupContainer){
        ReactDOM.unmountComponentAtNode(this.gameEventPopupContainer);
      }
    }

    // actionPopupを消す
    async hideActionPopUp(table : BlackJackTable) : Promise<void> {
      this.updatePlayerAction(table.getTurnNumber(), table.getPlayers()[table.getTurnNumber()]);
      //to do scoreが21の時非表示にできなくなるのを解消したい
      // const player = table.getPlayers()[table.getTurnNumber()];
      if(this.gameEventPopupContainer){
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1000)),
          table.changeTurnNumber(),
          ReactDOM.unmountComponentAtNode(this.gameEventPopupContainer),
        ])
        table.actionPhase(this);
      }
    }
}