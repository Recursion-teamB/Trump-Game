import { SpeedTable } from "../../model/Speed/SpeedTable";
import { SpeedPlayer } from "../../model/Speed/SpeedPlayer";
import ReactDOM from 'react-dom';
import { ResultPopup } from "../../components/Speed/resultPopup";
import { Card, Position } from '../../model/General/general';

export class SpeedGameScene extends Phaser.Scene {
    private player: SpeedPlayer = new SpeedPlayer("You", "player");
    private cpu : SpeedPlayer = new SpeedPlayer("CPU", "CPU")
    private table: SpeedTable = new SpeedTable();
    private screenWidth : number = 0;
    private screenHeight : number = 0;
    private cardWidth : number = 0;
    private cardHeight : number = 0;
    private playerHands : Phaser.GameObjects.Image[] = new Array(4);
    private cpuHands : Phaser.GameObjects.Image[] = new Array(4);
    private fieldCard : Phaser.GameObjects.Image[] = new Array(2);
    private playerCardPositions : Position[] = new Array(4);
    private cpuCardPositions : Position[] = new Array(4);
    private playerDeckPosition : Position = new Position(0,0);
    private cpuDeckPosition : Position = new Position(0,0);
    private fieldPositions : Position[] = new Array(2);
    private click : number = -1;

    private resultPopupContainer : HTMLElement | null = null;


    constructor() {
        super({ key: 'SpeedGameScene' });
    }

    preload() {
        // this.load.image('back', 'assets/back.jpg');
        // this.load.image('help', 'assets/help-icon.png');
        // //this.load.image('back_home', 'assets/back_home.png');
        // const suits = Deck.getSuitList();
        // for (let i = 1; i <= 13; i++) {
        //     suits.forEach(suit => {
        //         this.load.image(`${suit}${i}`, `assets/card_img/${suit}${i}.png`);
        //     });
        // }
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

        this.player = new SpeedPlayer("You","Player")
        this.cpu = new SpeedPlayer("CPU", "CPU")

        this.table.setPlayers([this.player, this.cpu]);

        //プレイヤーの名前の表示
        //this.add.text()

        //デッキの追加
        this.createPlayerDeckView()
        this.createCpuDeckView()

        // 手札の追加
        this.firstDeal()


        await this.createEventDisplay("Ready", 2000);
        await this.createEventDisplay("Start", 800);

        this.table.updateFieldCard(this)
    }

    update() {

    }

    playerClick(){

    }

    addDrag(card : Phaser.GameObjects.Image, handIndex : number){
        this.resultPopupContainer = document.createElement('div');
        document.body.appendChild(this.resultPopupContainer);
        card.setInteractive();
        this.input.setDraggable(card);
        let startPosition = new Position(card.x, card.y);
        card.on('drag', (pointer : any, dragX : any, dragY : any) =>
        {
            card.x = dragX;
            card.y = dragY;
        })
        let scene : SpeedGameScene = this;
        card.on('dragend', function (pointer : any){
            console.log("x : " + card.x + " y :" + card.y)
            let player = scene.table.getPlayers()[0];
            let playerCard = player.getHand()[handIndex];

            let index = scene.isFieldOverLap(new Position(card.x, card.y));

            if (index !== -1) {
                let fieldCard = scene.getTable().getFieldCard()[index]
                // この移動が有効か判定
                if (scene.table.isOnCard(playerCard, fieldCard)) {
                    console.log("有効");
                    card.x = scene.fieldPositions[index].x;
                    card.y = scene.fieldPositions[index].y;
                    card.depth = 3;
                    card.disableInteractive();
                    scene.table.moveCardHandToField(index, handIndex, player, scene);
                }
                else if(index === 0 || index === 1) {
                    card.x = startPosition.x;
                    card.y = startPosition.y;
                }
                else{
                    alert("不正な処理");
                }
            }
            else {
                card.x = startPosition.x;
                card.y = startPosition.y;
            }
        })
    }

    // オブジェクトの重なりを判定する関数
    isOverLap(position1 : Position, position2 : Position) : boolean{
        console.log("field " + position1.x + "." + position1.y);
        console.log("card " + position2.x + "." + position2.y);
        if(Math.max(Math.abs(position1.x - position2.x), Math.abs(position1.y - position2.y)) < 100){
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
        console.log("no kasanari");
        return -1;
    }

    // 真ん中に文字を表示して消す関数
    async createEventDisplay(str : string, lateTime : number) : Promise<void> {
        let rectangle = this.add.graphics().setDepth(9);
        rectangle.fillStyle(0x000000, 0.7);
        rectangle.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // テキストを作成して中央に配置する
        let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, str, {
            font: "60px Arial",
        });
        text.setOrigin(0.5);
        text.setDepth(10);

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
    showResultPopUp(text : string){
        this.scene.pause();
        if (!this.resultPopupContainer) {
          return;
        }
        ReactDOM.render(
          <ResultPopup
            text={text}
            quit={() => {
              console.log("quit")
              this.hideDescription()
              this.scene.stop(this)
              this.scene.start("LobbyScene")    
            }}
            restart={() => {
                this.hideDescription()
                this.scene.restart(this);
            }}
            />,
            this.resultPopupContainer
        );
      }

      hideDescription() : void{
        if (this.resultPopupContainer) {
          ReactDOM.unmountComponentAtNode(this.resultPopupContainer);
        }
        this.scene.resume();
      }
    // 初期のカードを配る
    public firstDeal() : void {
        const handLength = 4;
        let cpu = this.table.getPlayers()[1];
        let player = this.table.getPlayers()[0];
        for(let i : number = 0; i < handLength; ++i){

            let cpuCard = cpu.getDeck().draw();
            let playerCard = player.getDeck().draw();
            this.moveCpuDeckToHand(cpuCard, i, i*400);
            this.movePlayerDeckToHand(playerCard, i, i*400);
            cpu.addHand(cpuCard);
            player.addHand(playerCard);
        }
        console.log(player.getHand());
    }

    // cpuのデッキからhandにカードを移動する
    public moveCpuDeckToHand(card : Card, handIndex : number, delayTime : number) : void{
        let backCard = this.add.image(this.cpuDeckPosition.x, this.cpuDeckPosition.y, 'back').setDisplaySize(this.cardWidth, this.cardHeight).setDepth(4);// .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: backCard,
            x: this.cpuCardPositions[handIndex].x,
            y: this.cpuCardPositions[handIndex].y,
            duration: 300,
            delay: delayTime,
            onComplete: () => {
                this.flipCard(backCard, card);
            }
        });
        this.cpuHands[handIndex] = backCard;
    }

    // プレイヤーのデッキからhandにカードを移動する
    public movePlayerDeckToHand(card : Card, handIndex : number, delayTime : number) : void{
        const backCard = this.add.image(this.playerDeckPosition.x, this.playerDeckPosition.y, 'back').setDisplaySize(this.cardWidth, this.cardHeight).setInteractive().setDepth(4);// .setOrigin(0.5, 0.5);

        // backCard.input.hitArea = new Phaser.Geom.Rectangle(0, 0, backCard.width*2, backCard.height*2);

        this.tweens.add({
            targets: backCard,
            x: this.playerCardPositions[handIndex].x,
            y: this.playerCardPositions[handIndex].y,
            duration: 300,
            delay: delayTime,
            onComplete: () => {
                this.flipCard(backCard, card);
                this.addDrag(backCard, handIndex);
            }
        });
        this.playerHands[handIndex] = backCard;
        backCard.on('pointerdown', () => {
            this.click = handIndex;
            console.log("click");
        })
    }

    // カードを表に裏返す
    public flipCard(cardImage: Phaser.GameObjects.Image, card: Card): void {
        this.tweens.add({
            targets: cardImage,
            scaleX: 0,
            duration: 100,
            onComplete: () => {
            cardImage.setTexture(card.getImg()).setDisplaySize(this.cardWidth, this.cardHeight);// .setOrigin(0.5, 0.5);
            },
        });
    }

    // デッキから台札へカードを移動する関数、基本的にゲーム再開時に使用される。
    public moveDeckToField(card : Card, player : SpeedPlayer){

        let index = 0;
        if(player.getType() === "CPU") index = 1;
        let deck = index === 0? this.playerDeckPosition : this.cpuDeckPosition

        const backCard = this.add.image(deck.x, deck.y, 'back').setDisplaySize(this.cardWidth, this.cardHeight).setDepth(3);

        this.tweens.add({
            targets: backCard,
            x: this.fieldPositions[index].x,
            y: this.fieldPositions[index].y,
            duration: 300,
            delay: 100,
            onComplete: () => {
                this.flipCard(backCard, card);
            }
        })
        this.getFieldCard()[index] = backCard;
    }

    // cpuのhandから台札へ移動するアニメーション
    public moveCpuHand(fieldCard : Card, handIndex : number, fieldIndex : number){
        let handImages : Phaser.GameObjects.Image[] = this.getCpuHand();
        let cpu : SpeedPlayer = this.table.getPlayers()[1];
        let cardImage : Phaser.GameObjects.Image = handImages[handIndex]
        let startPosition : Position = this.cpuCardPositions[handIndex];

        this.tweens.add({
            targets: cardImage,
            x: this.fieldPositions[fieldIndex].x,
            y: this.fieldPositions[fieldIndex].y,
            ease: 'Linear',
            duration: 400,
            delay: 1000,
            repeat: 0,
            yoyo: false,
            onComplete: () => {

                // アニメーション終了後移動が有効であったか判定してその結果によって処理を変える
                // 有効ならそのまま続行、無効ならカードの位置を戻して、次へ
                console.log("同時か？")
                this.table.setCpuAction(true);
                fieldCard = this.table.getFieldCard()[fieldIndex]
                if(this.table.isOnCard(cpu.getHand()[handIndex], fieldCard)){
                    console.log("まだわからん")
                    this.table.moveCardHandToField(fieldIndex, handIndex, cpu, this);
                }
                else{
                    console.log("同時だった")
                    console.log("戻ってるね")
                    // this.getFieldCard()[fieldIndex].visible = true;
                    cardImage.x = startPosition.x;
                    cardImage.y = startPosition.y;
                    cpu.cpuBehavior(this.table, this);
                }
            }
        })
    }

    // 再開時deckがなければ使用される
    public moveHandToField(card : Card, handIndex : number, fieldIndex : number, player : SpeedPlayer, duration : number){
        let handImages = player.getType() === "CPU" ? this.getCpuHand(): this.getPlayerHand();
        let handImage = handImages[handIndex]
        let index = player.getType() === "CPU" ? 1: 0;

        this.tweens.add({
            targets: handImage,
            x: this.fieldPositions[fieldIndex].x,
            y: this.fieldPositions[fieldIndex].y,
            ease: 'Linear',
            duration: duration,
            repeat: 0,
            yoyo: false,
        })

        this.fieldCard[index] = handImage;
    }

    public setFieldDepth(){
        for(let card of this.fieldCard){
            card.depth = 3;
        }
    }
}

