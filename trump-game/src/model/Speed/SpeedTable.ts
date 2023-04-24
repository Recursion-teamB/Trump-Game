import { Card, Deck } from '../General/general'
import { SpeedPlayer } from './SpeedPlayer'
import { SpeedGameScene } from '../../scene/Speed/SpeedGame'

export class SpeedTable {
    private phase : string = 'initial'
    private fieldCard : Card[] = new Array(2);
    private players : SpeedPlayer[] = [new SpeedPlayer("You", "Player"), new SpeedPlayer("CPU", "CPU")];
    private canCpuAction : boolean = true; // cpuがAction可能な時true不可能な時false

    // ゲッター
    public getPhase() : string{
        return this.phase;
    }
    public getCpuAction() : boolean{
        return this.canCpuAction;
    }
    public getFieldCard() : Card[]{
        return this.fieldCard;
    }
    public getPlayers() : SpeedPlayer[] {
        return this.players;
    }

    public setPhase(phase : string) : void{
        this.phase = phase;
    }
    public setCpuAction(bool : boolean) : void{
        this.canCpuAction = bool;
    }
    public setPlayers(players : SpeedPlayer[]) : void{
        this.players = players;
    }

    // 台札に置けるカードが2人のプレイヤーの場札にあるのか判定。あればtrue,無ければfalse
    public isContinue() : boolean{
        for(let player of this.players){
            if(player.hasOnTopCard(this)){
                return true;
            }
        }
        return false;
    }

    // ゲーム開始時または重ねられるカードがない場合に台札を更新する関数
    public async updateFieldCard(scene : SpeedGameScene) : Promise<void>{
        // scene.createDrag();
        for(let i = 0; i < 2; ++i){
            const player : SpeedPlayer = this.players[i];

            // deckが空ではないとき、deckから台札へ
            if(!player.getDeck().isEmpty()){
                this.fieldCard[i] = player.getDeck().draw();
                if(i === 0){
                    scene.moveDeckToField(this.fieldCard[i], this.players[i]);
                }
                else{
                    scene.moveDeckToField(this.fieldCard[i], this.players[i]);
                }
            }
            // deckが空の場合の処理handからfieldへ
            else{
                const hand = player.getHand();
                const handLength = hand.length;
                let popCard;
                let index = 0;
                for(let j = 0; j < handLength; ++j){
                    let card = hand[j];
                    if(card.getSuit() !== "null"){
                        popCard = card;
                        hand[j] = new Card("null", "null")
                        break;
                    }
                    ++index;
                }

                if(popCard !== undefined){
                    this.fieldCard[i] = popCard;
                }
                if(i === 0){
                    scene.moveHandToField(this.fieldCard[i], index, i, this.players[i], 300);
                }
                else{
                    scene.moveHandToField(this.fieldCard[i], index, i, this.players[i], 300)
                }
                scene.setFieldDepth();
            }
        }

        // 今回の台札のアップデートでゲームが進められるのか判定(2人の参加者のhandにfieldに重ねられるカードがあるか？)、参加者双方のhandに重ねられるカードがなければもう一度この関数を呼び出す。
        if(!this.isContinue()){
            console.log('re');
            if(this.isSettled(scene)) return;
            await scene.createEventDisplay("Ready", 1000);
            this.updateFieldCard(scene);
        }
        // 重ねられるカードがある場合
        else {
            this.phase = "game";
            // control.hasTurn();
            console.log('cpu move')
            this.players[1].cpuBehavior(this, scene);
        }

    }

    // cardとfieldが重ねられるか判定。重ねられればtrue出来なければfalse
    public isOnCard(card : Card, field : Card) : boolean{
        // console.log(field);
        if(card.getSuit() === "null" || field.getSuit() === "null") return false;
        let num : number = card.getRank();
        let target : number = field.getRank();

        if(num === 1){
            if(target === 13 || target === 2){
                return true;
            }
        }
        else if(num === 13){
            if(target === 1 || target === 12){
                return true;
            }
        }
        else{
            if(Math.abs(num - target) === 1){
                return true;
            }
        }
        return false;
    }

    // カードを手札から台札へ移動する裏の処理を実行する関数。ゲームの再開時ではなく、playの流れの中で使う。
    public async moveCardHandToField(fieldIndex : number, cardIndex : number, player : SpeedPlayer, scene : SpeedGameScene) : Promise<void>{
        // fieldの書き換え
        this.fieldCard[fieldIndex] = player.getHand()[cardIndex];
        scene.getFieldCard()[fieldIndex].destroy();

        if(player.getType() === "CPU"){
            scene.getFieldCard()[fieldIndex] = scene.getCpuHand()[cardIndex];
        }
        else{
            scene.getFieldCard()[fieldIndex] = scene.getPlayerHand()[cardIndex];
        }

        scene.setFieldDepth();

        // handへのdeckからの追加
        const deck : Deck = player.getDeck();
        if(!deck.isEmpty()){
            let card : Card = deck.draw();
            player.getHand()[cardIndex] = card;
            if(player.getType() === "CPU"){
                scene.moveCpuDeckToHand(card, cardIndex, 300);
            }
            else{
                scene.movePlayerDeckToHand(card, cardIndex, 300);
                console.log(player.getHand());
            }
        }
        // deckがなければfieldへ行ったカードのある場所にnull cardを入れる
        else{
            player.getHand()[cardIndex] = new Card('null', 'null');
        }

        // この行動によって勝利条件を満たしたかを判定する。勝利していた場合、そのプレイヤーのtypeによって別の処理をする。
        // 手札が一枚しかなくそれをfieldにセットする場合の処理
        if(player.isComplete()){
            if(player.getType() === "CPU"){
                // プレイヤーが負けた画面の表示 and gameのstop
                scene.showResultPopUp("YOU LOSE")

            }
            else{
                // プレイヤーが勝った画面表示 and gameのstop
                scene.showResultPopUp("YOU WIN")
            }
        }
        else{
            if(!this.isContinue()){
                // どちらかの手札が残り一枚だった場合の処理
                if(this.isSettled(scene)) return;

                console.log("round change")
                await scene.createEventDisplay("Ready", 1000);
                this.updateFieldCard(scene);
            }
            if(this.canCpuAction) this.players[1].cpuBehavior(this, scene);
        }
    }

    public isSettled(scene: SpeedGameScene) : boolean{
        let player = this.players[0];
        let cpu = this.players[1];

        // まだ決着しない場合
        if(player.getDeckLength() !== 0 && cpu.getDeckLength() !== 0){
            return false;
        }
        if(player.countValid() >= 2 && cpu.countValid() >= 2){
            return false;
        }

        // 決着がつく場合
        if(player.countValid() <= 1 && cpu.countValid() <= 1){
            scene.showResultPopUp("YOU DRAW")
        }
        else if(player.countValid() <= 1){
            scene.showResultPopUp("YOU WIN")
        }
        else{
            scene.showResultPopUp("YOU LOSE")
        }
        return true;
    }
}