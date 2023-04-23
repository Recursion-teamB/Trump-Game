// import { SpeedPlayer, SpeedTable , SpeedCpuPlayer } from "../../model/Speed/speed";
import { SpeedCardManager } from "../../model/Speed/SpeedCardManager";
import { SpeedTable } from "../../model/Speed/SpeedTable";
import { SpeedPlayer } from "../../model/Speed/SpeedPlayer";
import { Deck, Position } from '../../model/General/general';
import { SpeedControl } from "../../model/Speed/Control";

export class SpeedGameScene extends Phaser.Scene {
    private player: SpeedPlayer = new SpeedPlayer("You", "player");
    private cpu : SpeedPlayer = new SpeedPlayer("CPU", "CPU")
    private table: SpeedTable = new SpeedTable();
    private screenWidth : number = 0;
    private screenHeight : number = 0;
    private cardWidth : number = 0;
    private cardHeight : number = 0;
    private playerHands : Phaser.GameObjects.Image[] = [];
    private cpuHands : Phaser.GameObjects.Image[] = [];
    private fieldCard : Phaser.GameObjects.Image[] = new Array(2);
    private playerCardPositions : Position[] = new Array(4);
    private cpuCardPositions : Position[] = new Array(4);
    private playerDeckPosition : Position = {x : 0, y : 0};
    private cpuDeckPosition : Position = {x: 0, y : 0};
    private fieldPositions : Position[] = new Array(2);
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


    public getTable() : SpeedTable{
        return this.table;
    }
    public getPlayerHand() : Phaser.GameObjects.Image[]{
        return this.playerHands;
    }
    public getFieldCard() : Phaser.GameObjects.Image[]{
        return this.fieldCard;
    }

    public getCpuHand() : Phaser.GameObjects.Image[]{
        return this.cpuHands;
    }

    async create() {
        // ゲームロジックの初期化
        this.cameras.main.setBackgroundColor(0x008800);
        this.screenWidth = this.cameras.main.width
        this.screenHeight = this.cameras.main.height
        this.cardWidth = this.screenWidth * 0.05
        this.cardHeight = this.cardWidth * 1.6

        //カードの配置を決定します.
        this.decidePosition()
        // const deck : Deck = new Deck('default')
        // const decks : Deck[]= [new Deck('black'), new Deck('red')]

        this.player = new SpeedPlayer("You","Player")
        this.cpu = new SpeedPlayer("CPU", "CPU")
        const playerCardManager : SpeedCardManager = new SpeedCardManager(this,this.player, this.player.getDeck(),this.screenWidth , this.screenHeight, this.playerDeckPosition, this.playerCardPositions, this.fieldPositions)
        const cpuCardManager : SpeedCardManager = new SpeedCardManager(this, this.cpu, this.cpu.getDeck(), this.screenWidth , this.screenHeight, this.cpuDeckPosition, this.cpuCardPositions, this.fieldPositions)
        this.table.setPlayers([this.player, this.cpu]);

        //プレイヤーの名前の表示
        //this.add.text()

        //デッキの追加
        this.createPlayerDeckView()
        this.createCpuDeckView()

        //手札の追加
        playerCardManager.firstDeal()
        cpuCardManager.firstDeal()

        await this.createEventDisplay("Ready", 2000);
        await this.createEventDisplay("Start", 800);

        let control = new SpeedControl(this, this.table, cpuCardManager, playerCardManager);
        control.hasTurn();

        // this.table.updateFieldCard(this, playerCardManager, cpuCardManager);
    }

    update() {

    }

    createDrag(manager : SpeedCardManager){
        console.log(this.playerHands);
        for(let i = 0; i < 4; ++i){
            const card : Phaser.GameObjects.Image = this.playerHands[i];
            this.input.setDraggable(card);
            this.input.on('drag', (pointer : any, gameObject : any, dragX : any, dragY : any) =>
            {

            gameObject.x = dragX;
            gameObject.y = dragY;

            });

            let scene : SpeedGameScene = this;
            this.input.on('dragend', function (pointer : any, gameObject : any) {
                let player = scene.getTable().getPlayers()[0]
                let playerCard = player.getHand()[i];
                // ドラッグしたカードがフィールドのカードと重なっているか判定する
                let index = scene.isFieldOverLap(new Position(card.x+card.displayWidth/2, card.y+card.displayHeight/2));
                if (index !== -1) {
                    let fieldCard = scene.getTable().getFieldCard()[index]
                    // この移動が有効か判定
                    if (scene.table.isOnCard(playerCard, fieldCard)) {
                        gameObject.x = scene.fieldPositions[index].x;
                        gameObject.y = scene.fieldPositions[index].y;
                        scene.table.moveCardHandToField(index, i, player, manager, scene);
                    } else {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                } else {
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                }
            });
        }
    }

    // オブジェクトの重なりを判定する関数
    isOverLap(position1 : Position, position2 : Position) : boolean{
        console.log("field " + position1.x + "." + position1.y);
        console.log("card " + position2.x + "." + position2.y);
        if(Math.max(Math.abs(position1.x - position2.x), Math.abs(position1.y - position2.y)) < 500){
            return true;
        }
        return false;
    }

    // フィールドカードにカードが重なっているか判定する
    isFieldOverLap(cardPosition : Position) : number{
        
        for(let i = 0; i < 2; ++i){
            let field = this.fieldPositions[i];
            if(this.isOverLap(field, cardPosition)) return i;
        }
        return -1;
    }

    // 真ん中に文字を表示して消す関数
    async createEventDisplay(str : string, lateTime : number) : Promise<void> {
        let rectangle = this.add.graphics().setDepth(1);
        rectangle.fillStyle(0x000000, 0.7);
        rectangle.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // テキストを作成して中央に配置する
        let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, str, {
            font: "60px Arial",
        });
        text.setOrigin(0.5);
        text.setDepth(1);

        await new Promise(resolve => setTimeout(resolve, lateTime));
        rectangle.destroy();
        text.destroy();
    }

    // 台札、プレイヤーとcpuの手札とデッキとの描画位置を決定する関数
    decidePosition(){
        const cpuHeight : number = this.screenHeight / 4
        const fieldHeight : number = this.screenHeight / 2
        const playerHeight : number = this.screenHeight * 3 / 4
        const centerX : number = this.screenWidth / 2
        let positionX : number = centerX

        //デッキと手札の場所を決定します
        //i = 2 を中心にする
        for (let i: number = 0; i < 4; i++) {
            this.playerCardPositions[i] = new Position(0,0);
            this.cpuCardPositions[i] = new Position(0,0);
        }
        for(let i : number = 0; i < 5; i++){
            positionX = centerX + (i - 2) * (this.cardWidth * 2.2)

            if(i === 0){
                this.playerDeckPosition.x = positionX
                this.cpuCardPositions[i].x = positionX
                this.cpuCardPositions[i].y = cpuHeight
            }else if(i === 4){
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
        for (let i: number = 0; i < 2; i++) {
            this.fieldPositions[i] = new Position(0, 0);
        }
        this.fieldPositions[0].x = this.screenWidth * 2 / 5;
        this.fieldPositions[0].y = fieldHeight;
        this.fieldPositions[1].x = this.screenWidth * 3 / 5;
        this.fieldPositions[1].y = fieldHeight;

        console.log("field 1 x: " + this.fieldPositions[0].x + " y: " + this.fieldPositions[0].y + '\n' + "field 2 x: " + this.fieldPositions[1].x + " y: " + this.fieldPositions[1].y)
    }

    // プレイヤーのdeckを描画する
    createPlayerDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.add.image(this.playerDeckPosition.x, this.playerDeckPosition.y, 'back');
        cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
        cardImage.setOrigin(0.5, 0.5);
    }

    // cpuのdeckの描画をする
    createCpuDeckView(): void {
        // カードをデッキの位置に裏向きで作成します
        const cardImage = this.add.image(this.cpuDeckPosition.x, this.cpuDeckPosition.y, 'back');
        cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
        cardImage.setOrigin(0.5, 0.5);
    }
}

