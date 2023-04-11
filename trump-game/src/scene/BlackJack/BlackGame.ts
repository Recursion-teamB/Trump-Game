import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';
import { Card } from '../../model/General/general';

export default class BlackGameScene extends Phaser.Scene {
    private dealerPosition: {x: number; y : number} = {x: 0, y: 0};
    private playerPositions: { [key: string]: { x: number; y: number } } = {};
    private table : BlackJackTable;
    private width : number = 0
    private height : number = 0
    private cardWidth : number = 0
    private cardHeight : number = 0
  
    constructor(player : BlackJackPlayer, table : BlackJackTable) {
      super({ key: 'BlackGameScene'});
      this.table = new BlackJackTable(new BlackJackPlayer("Player", "Player"));
      
    }

    preload() {
        this.load.image('back', 'assets/back.jpg');
        //this.load.image('help', 'assets/buttons/help.png');
        //this.load.image('back_home', 'assets/buttons/back_home.png');
        const suitArr = ['s','d','h','c']
        for(const suit of suitArr){
            for(let i = 1; i <= 13; i++ ){
                this.load.image(`${suit}${i}`,`assets/card_img/${suit}${i}.png`)
            }
        }
    }
    
    create() {
        this.width = this.cameras.main.width
        this.height = this.cameras.main.height
        this.cardWidth = this.width * 0.04
        this.cardHeight = this.cardWidth * 1.6
        let player : BlackJackPlayer = new BlackJackPlayer("Player", "Player");
        let table : BlackJackTable = new BlackJackTable(player);
        table.distributeCards();
        // 背景を緑色に設定
        this.cameras.main.setBackgroundColor(0x008800);
        this.dealerPosition.x = this.width /2
        this.dealerPosition.y = this.height * 0.2
    
        // ヘルプボタンとバックホームボタンを作成
        const helpButton = this.add.image(50, 50, 'help').setInteractive();
        const backHomeButton = this.add.image(150, 50, 'back_home').setInteractive();
      
        const cardManager = new CardManager(this, table, this.cardWidth, this.cardHeight)
        cardManager.createDeckView();
        this.decideDealerPostion();
        this.decidePlayerPosition();
        cardManager.firstDealCardToAllPlayers(this.dealerPosition,this.playerPositions)

        // 山札を作成
        //const screenWidth = this.cameras.main.width;
        //const screenHeight = this.cameras.main.height;
        //const deckWidth = screenWidth * 0.04;
        //const deckHeight = screenHeight * 0.1;
    
        /*const deck = this.add.image(screenWidth / 2, screenHeight / 2, 'back');
        deck.setDisplaySize(deckWidth, deckHeight);
    
        // ディーラーの手札とテキストを作成
        const dealerCards = table.getHouse().getHand();
        dealerCards.forEach((card, index) => {
          const dealerCard = card.createPhaserImg(this, deck.x - deckWidth * 3 + (index * deckWidth * 1.2), deck.y - deckHeight * 3);
          dealerCard.setDisplaySize(deckWidth, deckHeight);
        });*/
        /*const dealerText = this.add.text(deck.x - deckWidth / 2, deck.y - deckHeight * 1.0, 'dealer', {
            fontFamily: 'Arial',
            fontSize: '20px'
        });*/
    
        // プレイヤーの手札とテキストを作成
        /*
        const numPlayers = table.getPlayers().length;
        for (let i = 0; i < numPlayers; i++) {
            const playerCard = table.getPlayers()[i].getHand()
            playerCard.forEach((card, index) => {
                card.createPhaserImg(this, deck.x + (i - 1) * deckWidth * 3 + (index * deckWidth * 1.2), deck.y + deckHeight * 3);
                card.getPhaserImage().setDisplaySize(deckWidth, deckHeight);
          });
          //const playerText = this.add.text(deck.x - (i - 1) * deckWidth * 3, deck.y - deckHeight * 1.0, 'player');
        }*/
      }
    decideDealerPostion() : void{
      this.dealerPosition.x = this.width / 2
      this.dealerPosition.y = this.height * 0.15
      const dealerText = this.add.text(this.dealerPosition.x, this.dealerPosition.y + this.cardHeight / 2 + this.height * 0.05, this.table.getHouse().getName())
      dealerText.setOrigin(0.5, 0.5);
    }

    decidePlayerPosition() : void{
        const playerArr = this.table.getPlayers()
        const count = playerArr.length;
        // プレイヤーの位置データを連想配列に追加します
        console.log(playerArr)
        let positionY = this.height * 0.85
        for(let i= 0; i < count; i++){
            const positionX = (this.width / count) * (0.5 + i)
            this.playerPositions[playerArr[i].getName()] = { x: positionX, y: positionY};
            const playerText = this.add.text(positionX, positionY + this.cardHeight / 2 + this.height * 0.05, playerArr[i].getName())
            playerText.setOrigin(0.5, 0.5);
        }
    }
    getCardWidth() : number{
      return this.cardWidth
    }
    getCardHeight() : number{
      return this.cardHeight
    }
}

export class CardManager {
    private scene: Phaser.Scene;
    private table: BlackJackTable
    private cards: Phaser.GameObjects.Image[];
    private deckPosition = { x: 0, y: 0 };
    private cardWidth: number;
    private cardHeight: number;
  
    constructor(scene: Phaser.Scene, table: BlackJackTable, cardWidth: number, cardHeight: number) {
      this.scene = scene;
      this.table = table
      this.cards = [];
      this.deckPosition.x = this.scene.cameras.main.width / 2;
      this.deckPosition.y = this.scene.cameras.main.height / 2;
      this.cardWidth = cardWidth
      this.cardHeight = cardHeight
    }
  
    public createDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
        cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
        cardImage.setOrigin(0.5, 0.5);
    }


    public dealCard(card: Card, x: number,y: number, flipOver : boolean ,duration: number = 500): Phaser.GameObjects.Image | null {
      if (this.table.getDeck().getDeck().length > 0) {
        //const card = this.deck.draw();
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
            const cardTexture = `${card.getSuit()}${card.getRank()}`;
            cardImage.setTexture(cardTexture);
            cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
          }, duration + 100 );
        }
        
        return cardImage;
      }
      return null;
    }
  
    public dealCardToPlayer(player: BlackJackPlayer,card: Card, positionX : number, positionY : number, flipCard: boolean, duration: number = 500 ): void {
      const cardImage = this.dealCard(card, positionX, positionY, flipCard);
      if (cardImage) {
        const cardData: Card = cardImage.getData(card.getSuit() + card.getRank());
        player.addHand(cardData);
      }
    }

    //最初にこれを呼び出せばカードが配られ, 配置されるようにする.
    public firstDealCardToAllPlayers(dealerPosition : {x :number; y : number}, playerPositions: { [key: string]: { x: number; y: number } }){
        let count = 0
        for(let i = 0; i < 2; i++){
            for (const player of this.table.getPlayers() ) {
              setTimeout(() => {
                const card = this.table.getDeck().draw()
                console.log(card.getSuit() + card.getRank())
                const playerPosition = playerPositions[player.getName()]
                this.dealCardToPlayer(player, card, (playerPosition.x - this.cardWidth / 2) + i * (this.cardWidth + 6), playerPosition.y, true);
              }, 700 * count );
              count ++
            }
        }
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            const card = this.table.getDeck().draw()
            this.dealCardToPlayer(this.table.getHouse(), card, (dealerPosition.x - this.cardWidth / 2 )+ i * (this.cardWidth + 6), dealerPosition.y, i === 0);
          }, 700 * count );
          count ++
        }
    }
  }
  