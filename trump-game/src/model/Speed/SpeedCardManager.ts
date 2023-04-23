import { Card, Deck, Position } from '../General/general'
import { CardManager } from '../General/general'
import { SpeedGameScene } from '../../scene/Speed/SpeedGame'
import { SpeedPlayer } from './SpeedPlayer'



export class SpeedCardManager extends CardManager<SpeedGameScene>{
    private player : SpeedPlayer
    private deckPosition : Position
    private handPositions : Position[]
    private fieldPositions : Position[]
    constructor(scene: SpeedGameScene, player: SpeedPlayer, deck: Deck, width: number, height: number, deckPosition : Position, handPositions : Position[], fieldPosition: Position[]) {
        super(scene, deck, width, height)
        this.player = player
        this.deckPosition = deckPosition
        this.handPositions = handPositions
        this.fieldPositions = fieldPosition
    }

    // 最初のカードを配る関数手札と台札が配られる各デッキから
    public async firstDeal() : Promise<void> {
        const dealDuration = 300; // アニメーションの持続時間をミリ秒で設定
        const delayBetweenCards = 100; // カード間の遅延をミリ秒で設定
        const handLength = 4;

        for (let i: number = 0; i < handLength; ++i) {
            const card = this.player.getDeck().draw();
            this.player.addHand(card);
            const backCard = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back').setInteractive().setDepth(1);
            backCard.setOrigin(0.5, 0.5);
            backCard.setDisplaySize(this.cardWidth, this.cardHeight);

            await Promise.all([
                this.scene.tweens.add({
                    targets: backCard,
                    x: this.handPositions[i].x,
                    y: this.handPositions[i].y,
                    duration: dealDuration,
                    delay: i* (dealDuration + delayBetweenCards),
                    onComplete: () => {
                        this.flipCard(backCard, card);
                    }
                }),
            ])

            if(this.player.getType() === "CPU"){
                this.scene.getCpuHand().push(backCard);
            }
            else{
                this.scene.getPlayerHand().push(backCard);
            }
        }
    }

    public moveDeckToHand(card : Card, handIndex : number) : void{

        const backCard = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
        backCard.setOrigin(0.5, 0.5);
        backCard.setDisplaySize(this.cardWidth, this.cardHeight);
        backCard.setDepth(2);

        this.scene.tweens.add({
            targets: backCard,
            x: this.handPositions[handIndex].x,
            y: this.handPositions[handIndex].y,
            duration: 400,
            delay: 100,
            onComplete: () => {
                this.flipCard(backCard, card);
            }
        });
        if(this.player.getType() === "CPU"){
            this.scene.getCpuHand()[handIndex] = backCard;
        }
        else{
            this.scene.getPlayerHand()[handIndex] = backCard;
        }
    }

    async flipCard(cardImage: Phaser.GameObjects.Image, card: Card): Promise<void> {
        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: cardImage,
                scaleX: 0,
                duration: 100,
                onComplete: () => {
                cardImage.setTexture(card.getImg()).setDisplaySize(this.cardWidth, this.cardHeight).setOrigin(0.5, 0.5);
                    resolve();
                },
            });
        });
    }

    // cpuのhandをfieldに移動する関数、移動アニメーションが終了した時点で重ねられる場合と重ねられない場合で分岐する
    public moveCpuHand(card : Card, handIndex : number, fieldIndex : number){
        if(this.player.getType() !== "CPU") return;
        let handImages = this.scene.getCpuHand();
        let table = this.scene.getTable();
        // handImages[handIndex].setDepth(2);
        console.log(this.fieldPositions[fieldIndex].x);
        this.scene.tweens.add({
            targets: handImages[handIndex],
            x: this.fieldPositions[fieldIndex].x,
            y: this.fieldPositions[fieldIndex].y,
            ease: 'Linear',
            duration: 400,
            delay: 1000,
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                this.scene.getFieldCard()[fieldIndex].visible = false;
                // カード移動のアニメーションが完了した時点でカードが重ねられるか判定する.trueなら続行
                if(table.isOnCard(this.player.getHand()[handIndex], table.getFieldCard()[fieldIndex])){
                    table.moveCardHandToField(fieldIndex, handIndex, this.player, this, this.scene);
                }
            }
        })
    }

    // デッキから台札へカードを移動する関数,基本的にゲーム再開時に使用される
    public moveDeckToField(card : Card){
        let index = 0;
        if(this.player.getType() === "CPU") index = 1;

        console.log(card.getRank());
        const backCard = this.scene.add.image(this.deckPosition.x, this.deckPosition.y, 'back');
        backCard.setOrigin(0.5, 0.5);
        backCard.setDisplaySize(this.cardWidth, this.cardHeight);
        backCard.setDepth(1);

        this.scene.tweens.add({
            targets: backCard,
            x: this.fieldPositions[index].x,
            y: this.fieldPositions[index].y,
            duration: 300,
            delay: 100,
            onComplete: () => {
                this.flipCard(backCard, card);
            }
        });
        this.scene.getFieldCard()[index] = backCard;
    }

    // handから台札へカードを移動する関数、ゲームの再開時にdeckが無ければ使用される。
    public moveHandToField(card : Card, handIndex : number, fieldIndex : number){
        let handImages = this.player.getType() === "CPU" ? this.scene.getCpuHand(): this.scene.getPlayerHand();
        this.scene.tweens.add({
            targets: handImages[handIndex],
            x: this.fieldPositions[fieldIndex].x,
            y: this.fieldPositions[fieldIndex].y,
            ease: 'Linear',
            duration: 2000,
            repeat: 0,
            yoyo: false,
        })
    }
}

