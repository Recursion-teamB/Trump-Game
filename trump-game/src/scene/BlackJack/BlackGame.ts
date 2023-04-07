import { BlackJackPlayer, BlackJackTable } from '../../model/BlackJack/blackjack';

export default class BlackGameScene extends Phaser.Scene {
    constructor() {
        super({key: "BlackGameScene"})
    }

    preload() {
        this.load.image('back', 'assets/back.jpg');
        //this.load.image('help', 'assets/buttons/help.png');
        //this.load.image('back_home', 'assets/buttons/back_home.png');
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
      }
}