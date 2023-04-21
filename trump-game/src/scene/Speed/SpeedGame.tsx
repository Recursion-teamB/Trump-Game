import { SpeedPlayer, SpeedTable , SpeedCpuPlayer, SpeedDeck} from "../../model/Speed/speed";
import { Card, Deck, Player,CardManager } from '../../model/General/general';

export class SpeedGameScene extends Phaser.Scene {
    private player: SpeedPlayer = new SpeedPlayer("Player", "player", new SpeedDeck());
    private cpu : SpeedCpuPlayer = new SpeedCpuPlayer("CPU", new SpeedDeck())
    private table: SpeedTable = new SpeedTable();
    private screenWidth : number = 0;
    private screenHeight : number = 0;
    private cardWidth : number = 0;
    private cardHeight : number = 0;
    private playerCardPositions : {x: number, y: number}[] = new Array(4);
    private cpuCardPositions : {x: number, y : number}[] = new Array(4);
    private playerDeckPosition : {x: number, y : number} = {x : 0, y : 0};
    private cpuDeckPosition : {x: number, y : number} = {x: 0, y : 0};
    private pilePositions : {x: number, y : number}[] = new Array(2);
    //private cardManager: SpeedCardManager = new SpeedCardManager(this, this.table, this.table.getDeck(), this.screenWidth, this.screenHeight)

    constructor() {
        super({ key: 'SpeedGame' });
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
        // ゲームロジックの初期化
        this.cameras.main.setBackgroundColor(0x008800);
        this.screenWidth = this.cameras.main.width
        this.screenHeight = this.cameras.main.height
        this.cardWidth = this.screenWidth * 0.05
        this.cardHeight = this.cardWidth * 1.6

        //カードの配置を決定します.
        this.decidePoistion()
        const deck : SpeedDeck = new SpeedDeck()
        const decks : SpeedDeck[]= SpeedDeck.makeDevidedDeck(deck)
        console.log(decks)
        this.player = new SpeedPlayer("Player","player",decks[0])
        this.cpu = new SpeedCpuPlayer("CPU",decks[1])
        const playerCardManager : SpeedCardManager = new SpeedCardManager(this,this.player, this.player.getDeck(),this.screenWidth , this.screenHeight, this.playerDeckPosition, this.playerCardPositions, this.pilePositions[0])
        const cpuCardManager : SpeedCardManager = new SpeedCardManager(this, this.cpu, this.cpu.getDeck(),this.screenWidth , this.screenHeight, this.cpuDeckPosition, this.cpuCardPositions, this.pilePositions[1])
        this.table.addPlayer(this.player);
        this.table.addPlayer(this.cpu);

        //プレイヤーの名前の表示
        //this.add.text()

        //デッキの追加
        this.createPlayerDeckView()
        this.createCpuDeckView()
        
        //手札の追加
        playerCardManager.firstDeal()
        cpuCardManager.firstDeal()

        //playerCardManager.pileSet()
        //cpuCardManager.pileSet()
    }

    update() {
        
    }

    decidePoistion(){
        const cpuHeight : number = this.screenHeight / 4
        const pileHeight : number = this.screenHeight / 2
        const playerHeight : number = this.screenHeight * 3 / 4
        const centerX : number = this.screenWidth / 2
        let positionX : number = centerX

        //デッキと手札の場所を決定します
        //i = 2 を中心にする
        for (let i: number = 0; i < 4; i++) {
            this.playerCardPositions[i] = { x: 0, y: 0 };
            this.cpuCardPositions[i] = { x: 0, y: 0 };
        }
        for(let i : number = 0; i < 5; i++){
            positionX = centerX + (i - 2) * (this.cardWidth * 2.2)

            if(i == 0){
                this.playerDeckPosition.x = positionX
                this.cpuCardPositions[i].x = positionX
                this.cpuCardPositions[i].y = cpuHeight
            }else if(i == 4){
                this.playerCardPositions[i - 1].x = positionX
                this.playerCardPositions[i - 1].y = playerHeight
                this.cpuDeckPosition.x = positionX
            }else{
                this.playerCardPositions[i - 1].x = positionX
                this.playerCardPositions[i - 1].y = playerHeight
                this.cpuCardPositions[i].x = positionX
                this.cpuCardPositions[i].y = cpuHeight
            }            
        }
        this.playerDeckPosition.y = playerHeight
        this.cpuDeckPosition.y = cpuHeight
        
        //台札の場所を決定します.
        for (let i: number = 0; i < 4; i++) {
            this.pilePositions[i] = { x: 0, y: 0 };
        }
        this.pilePositions[0].x = this.screenWidth * 2 / 5;
        this.pilePositions[0].y = pileHeight;
        this.pilePositions[1].x = this.screenWidth * 3 / 5;
        this.pilePositions[1].y = pileHeight;
    }
    createPlayerDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.add.image(this.playerDeckPosition.x, this.playerDeckPosition.y, 'back');
        cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
        cardImage.setOrigin(0.5, 0.5);
    }
    createCpuDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.add.image(this.cpuDeckPosition.x, this.cpuDeckPosition.y, 'back');
        cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
        cardImage.setOrigin(0.5, 0.5);
    }
}
export class SpeedCardManager extends CardManager<SpeedGameScene>{
    private player : SpeedPlayer
    private deckPosition : {x : number, y : number}
    private handPositions : {x : number, y : number}[]
    private pilePosition : {x: number, y : number}
    constructor(scene: SpeedGameScene, player: SpeedPlayer,deck: Deck, width: number, height: number, deckPosition : {x : number, y : number}, handPositions : {x : number, y : number}[], pilePosition: {x : number, y : number}) {
        super(scene, deck, width, height)
        this.player = player
        this.deckPosition = deckPosition
        this.handPositions = handPositions
        this.pilePosition = pilePosition
    }
    public firstDeal() {
        const dealDuration = 300; // アニメーションの持続時間をミリ秒で設定
        const delayBetweenCards = 100; // カード間の遅延をミリ秒で設定
    
        for (let i: number = 0; i < this.handPositions.length; i++) {
            const card = this.player.getDeck().draw();
            console.log(card.getRank());
            this.player.addHand(card);
    
            // ここにアニメーションを追加
            this.scene.tweens.add({
                targets: card,
                x: this.handPositions[i].x,
                y: this.handPositions[i].y,
                duration: dealDuration,
                delay: i * (dealDuration + delayBetweenCards),
                onStart: () => {
                    this.dealCard(card, this.deckPosition.x, this.deckPosition.y, this.handPositions[i].x, this.handPositions[i].y, true);
                },
                onComplete: () => {
                    // 必要に応じて、プレイヤーのスコアやアクションの更新などの処理をここに追加
                    if(i === this.handPositions.length - 1){
                        this.pileSet()
                    }
                }
            });
        }
    }
    
    public pileSet(){
        let card : Card = this.player.getDeck().draw()
        this.dealCard(card, this.deckPosition.x, this.deckPosition.y, this.pilePosition.x, this.pilePosition.y,true)
    }
}

