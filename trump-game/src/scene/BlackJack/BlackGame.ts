import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';
import { Card, Deck, Player } from '../../model/General/general';

export default class BlackGameScene extends Phaser.Scene {
    constructor() {
        super({key: "BlackGameScene"})
    }

    preload() {
        this.load.image('back', 'assets/back.jpg');
        //this.load.image('help', 'assets/buttons/help.png');
        //this.load.image('back_home', 'assets/buttons/back_home.png');
        const suitArr = ['c','d','h','s']
        for(const suit in suitArr){
            for(let i = 1; i <= 13; i++ ){
                this.load.image(suit + i,`assets/card_img${suit + i}.png`)
            }
        }
    }
    
    create() {
        let player : BlackJackPlayer = new BlackJackPlayer("Player", "Player");
        let table : BlackJackTable = new BlackJackTable(player);
        table.distributeCards();
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
        const dealerCards = table.getHouse().getHand();
        dealerCards.forEach((card, index) => {
          const dealerCard = card.createPhaserImg(this, deck.x - deckWidth * 3 + (index * deckWidth * 1.2), deck.y - deckHeight * 3);
          dealerCard.setDisplaySize(deckWidth, deckHeight);
        });
        const dealerText = this.add.text(deck.x - deckWidth / 2, deck.y - deckHeight * 1.0, 'dealer', {
            fontFamily: 'Arial',
            fontSize: '20px'
        });
    
        // プレイヤーの手札とテキストを作成
        const numPlayers = table.getPlayers().length;
        for (let i = 0; i < numPlayers; i++) {
            const playerCard = table.getPlayers()[i].getHand()
            playerCard.forEach((card, index) => {
                card.createPhaserImg(this, deck.x + (i - 1) * deckWidth * 3 + (index * deckWidth * 1.2), deck.y + deckHeight * 3);
                card.getPhaserImage().setDisplaySize(deckWidth, deckHeight);
          });
          //const playerText = this.add.text(deck.x - (i - 1) * deckWidth * 3, deck.y - deckHeight * 1.0, 'player');
        }
        const cardManager = new CardManager(this, table)
        cardManager.firstDealCardToAllPlayers
      }
}

export class CardManager {
    private scene: Phaser.Scene;
    private table: BlackJackTable
    private cards: Phaser.GameObjects.Image[];
    private deckPosition = { x: 0, y: 0 };
  
    constructor(scene: Phaser.Scene, table: BlackJackTable) {
      this.scene = scene;
      this.table = table
      this.cards = [];
      this.deckPosition.x = this.scene.cameras.main.width / 2;
      this.deckPosition.y = this.scene.cameras.main.height / 2;
    }
  
    public createDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
        cardImage.setData('deck', this.table.getDeck())
    }

    //this.deck.drawを引数に入れてつかう
    public dealCard(card: Card, x: number,y: number,duration: number = 500): Phaser.GameObjects.Image | null {
      if (this.table.getDeck().getDeck().length > 0) {
        //const card = this.deck.draw();
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
        cardImage.setData(card.getSuit() + card.getRank(), card);
        this.cards.push(cardImage);
  
        // カードをプレイヤーの場所までアニメーションさせます
        this.scene.tweens.add({targets: cardImage, x: x, y: y, duration: duration, ease: 'Linear',});

        //表の画像に差し替えます. ひっくり返るようなアニメーションは追加してません.
        cardImage.setTexture(card.getSuit() + card.getRank());
        return cardImage;
      }
      return null;
    }
  
    public dealCardToPlayer(player: BlackJackPlayer,card: Card, positionX : number, positionY : number, duration: number = 500, ): void {
      const cardImage = this.dealCard(card, positionX, positionY, duration);
      if (cardImage) {
        const cardData: Card = cardImage.getData(card.getSuit() + card.getRank());
        player.addHand(cardData);
      }
    }

    //最初にこれを呼び出せばカードが配られ, 配置されるようにする.
    public firstDealCardToAllPlayers(playerPositions: { [key: string]: { x: number; y: number } }){
        for(let i = 0; i < 2; i++){
            for (const player of this.table.getPlayers() ) {
                const card = this.table.getDeck().draw()
                const playerPosition = playerPositions[player.getName()]
                this.dealCardToPlayer(player, card, playerPosition.x, playerPosition.y);
            }
        }
    }
  }
  