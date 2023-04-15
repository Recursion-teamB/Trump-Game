import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';

import Phaser from 'phaser';
import { Card, Deck } from '../../model/General/general';
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
    

    private dealerPosition: {x: number; y : number} = {x: 0, y: 0};
    private playerPositions: { [key: string]: { x: number; y: number } } = {};
    private screenWidth : number = 0
    private screenHeight : number = 0
    private cardWidth : number = 0
    private cardHeight : number = 0
    private cardManager: CardManager = new CardManager(this, this.table, this.screenWidth, this.screenHeight)
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
      this.screenWidth = this.cameras.main.width;
      this.screenHeight = this.cameras.main.height;
      this.dealerPosition.x = this.screenWidth /2
      this.dealerPosition.y = this.screenHeight * 0.2
      this.cardWidth = this.screenWidth * 0.05
      this.cardHeight = this.cardWidth * 1.6
      //初期値ではcardManagerの画面サイズが違うのでリセット
      this.cardManager = new CardManager(this, this.table, this.screenWidth, this.screenHeight)
      this.cameras.main.setBackgroundColor(0x008800);
      this.scene.launch('BlackGameSceneController');
      this.createHelpAndHomeButtons();


      //this.createDeck(this.screenWidth, this.screenHeight);
      this.cardManager.createDeckView()
      //this.createDealerSection(this.table, this.screenWidth / 2, this.screenHeight / 2);
      this.decideDealerPosition()
      //this.createPlayerSection(this.table, this.screenWidth / 2, this.screenHeight / 2);
      this.decidePlayerPosition()
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

    getDealerPosition(): {x: number; y : number}{
      return this.dealerPosition
    }
    getPlayerPositions():{ [key: string]: { x: number; y: number } }{
      return this.playerPositions
    }
    getCardManager() : CardManager{
      return this.cardManager
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
      // if(this.actionPopupContainer && (player.getAction() !== 'hit' && player.getAction() !== '')){
      //   ReactDOM.unmountComponentAtNode(this.actionPopupContainer);
      //   table.actionPhase(this);
      // }
    }
    decideDealerPosition() : void{
      this.dealerPosition.x = this.screenWidth / 2
      this.dealerPosition.y = this.screenHeight * 0.15
      const dealerText = this.add.text(this.dealerPosition.x, this.dealerPosition.y + this.cardHeight / 2 + this.screenHeight * 0.05, 'dealer', {
        fontFamily: 'Arial',
        fontSize: '15px'
      });
      dealerText.setOrigin(0.5, 0.5);
    }

    decidePlayerPosition() : void{
        const playerArr = this.table.getPlayers()
        const count = playerArr.length;
        // プレイヤーの位置データを連想配列に追加します
        console.log(playerArr)
        const positionY = this.screenHeight * 0.86
        const actionHeight = positionY
        const textHeight = positionY + this.screenHeight * 0.03
        const chipHeight = positionY + this.screenHeight * 0.06
        const scoreHeight = positionY * this.screenHeight * 0.09
        for(let i= 0; i < count; i++){
            const positionX = (this.screenWidth / count) * (0.5 + i)
            this.playerPositions[playerArr[i].getName()] = { x: positionX, y: positionY};

            const playerText = this.add.text(positionX, textHeight, `player : ${playerArr[i].getName()}`, {
              fontFamily: 'Arial',
              fontSize: '15px'
            });
            playerText.setOrigin(0.5, 0);

            const playerChip = this.add.text(positionX, chipHeight, `$${playerArr[i].getChips()}`, {
              fontFamily: 'Arial',
              fontSize: '15px'
            });
            playerChip.setOrigin(0.5, 0);
            const playerScore = this.add.text(positionX, scoreHeight, `Score : ${playerArr[i].calcScore()}`, {
              fontFamily: 'Arial',
              fontSize: '15px'
            });
            playerScore.setOrigin(0.5, 0);
            const playerAction = this.add.text(positionX, actionHeight, `${playerArr[i].getAction()}`, {
              fontFamily: 'Arial',
              fontSize: '15px'
            });
            playerAction.setOrigin(0.5, 0);
            this.playerChipsTexts[i] = playerChip;
            this.playerScoresTexts[i] = playerScore;
            this.playerActionTexts[i] = playerAction;
        }
    }
}

export class CardManager {
  private scene: BlackGameScene;
  private table: BlackJackTable
  private cards: Phaser.GameObjects.Image[];
  private deckPosition = { x: 0, y: 0 };
  private cardWidth: number;
  private cardHeight: number;

  constructor(scene: BlackGameScene, table: BlackJackTable, width: number, height: number) {
    this.scene = scene;
    this.table = table;
    this.cards = [];
    this.deckPosition.x = width / 2;
    this.deckPosition.y = height / 2;
    this.cardWidth = width * 0.05
    this.cardHeight = this.cardWidth * 1.6
  }

  public createDeckView(): void {
      // カードをデッキの位置に裏向きで作成します
      const cardImage = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
      cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
      cardImage.setOrigin(0.5, 0.5);
  }


  public dealCard(card: Card, x: number,y: number, flipOver : boolean ,duration: number = 200): Phaser.GameObjects.Image | null {
    if (this.table.getDeck().getDeck().length <= 0) {
      return null
    }
  
    // カードをデッキの位置に裏向きで作成します
    const cardImage = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
    cardImage.setOrigin(0.5, 0.5);
    cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
    cardImage.setData(card.getSuit() + card.getRank(), card);
    this.cards.push(cardImage);

    // カードをプレイヤーの場所までアニメーションさせます
    this.scene.tweens.add({targets: cardImage, x: x, y: y, duration: duration, ease: 'Linear',});

    //表の画像に差し替えます. ひっくり返るようなアニメーションは追加してません.
    //flipOverがtrueのときのみ裏返す.
    if(flipOver){
      setTimeout(() => {
        this.flipOverCard(card, cardImage)
      }, duration + 50 );
    }
    
    return cardImage;
  }

  public flipOverCard(card: Card, cardImage: Phaser.GameObjects.Image): Phaser.GameObjects.Image{
    const cardTexture = `${card.getSuit()}${card.getRank()}`;
    cardImage.setTexture(cardTexture);
    cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
    return cardImage
  }
  public dealCardToPlayer(player: BlackJackPlayer,card: Card, positionX : number, positionY : number, flipCard: boolean, duration: number = 200 ): void {
    const cardImage = this.dealCard(card, positionX, positionY, flipCard);
    if (cardImage) {
      const cardData: Card = cardImage.getData(card.getSuit() + card.getRank());
      player.addHand(cardData);
    }
  }

  //最初にこれを呼び出せばカードが配られ, 配置されるようにする.
  /*public firstDealCardToAllPlayers(dealerPosition : {x :number; y : number}, playerPositions: { [key: string]: { x: number; y: number } }){
      let count = 0
      for(let i = 0; i < 2; i++){
          for (const player of this.table.getPlayers() ) {
            setTimeout(() => {
              const card = this.table.getDeck().draw()
              console.log(card.getSuit() + card.getRank())
              const playerPosition = playerPositions[player.getName()]
              this.dealCardToPlayer(player, card, (playerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6), playerPosition.y - this.cardHeight / 2 - 2, true);
            }, 300 * count );
            count ++
          }
          setTimeout(() => {
            const card = this.table.getDeck().draw()
            this.dealCardToPlayer(this.table.getHouse(), card, (dealerPosition.x - this.cardWidth / 2 )+ i * (this.cardWidth + 6), dealerPosition.y, i === 0);
          }, 300 * count );
          count ++
      }
  }*/
    public firstDealCardToAllPlayers(dealerPosition: { x: number; y: number }, playerPositions: { [key: string]: { x: number; y: number } }) {
      const timeline = this.scene.tweens.createTimeline();

      for (let i = 0; i < 2; i++) {
          for (const [index, player] of this.table.getPlayers().entries()) {
              const card = this.table.getDeck().draw();
              console.log(card.getSuit() + card.getRank());
              const playerPosition = playerPositions[player.getName()];

              timeline.add({
                  targets: card,
                  x: (playerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6),
                  y: playerPosition.y - this.cardHeight / 2 - 2,
                  duration: 300,
                  onStart: () => {
                      this.dealCardToPlayer(player, card, (playerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6), playerPosition.y - this.cardHeight / 2 - 2, true);
                  },
                  onComplete: () => {
                    if(player.calcScore() === 21){
                      player.setAction("BlackJack");
                    }
                    this.scene.updatePlayerAction(index, player)
                  }
              });
              
          }
          
          const card = this.table.getDeck().draw();
          let notFinal : boolean = i === 0;
          timeline.add({
              targets: card,
              x: (dealerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6),
              y: dealerPosition.y,
              duration: 300,
              onStart: () => {
                  this.dealCardToPlayer(this.table.getHouse(), card, (dealerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6), dealerPosition.y, notFinal);
              },
              onComplete: () => {
                  // アニメーションが完了した後の処理（必要に応じて)
                  if(notFinal){
                    return null;
                  }
                  this.table.actionPhase(this.scene)
              }
          });
      }

      timeline.play();
  }
}
