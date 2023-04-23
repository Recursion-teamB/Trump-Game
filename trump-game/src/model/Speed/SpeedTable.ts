import { Card, Deck } from '../General/general'
import { SpeedPlayer } from './SpeedPlayer'
import { SpeedCardManager } from './SpeedCardManager';
import { SpeedGameScene } from '../../scene/Speed/SpeedGame'
import { SpeedControl } from './Control';

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
    public async updateFieldCard(scene : SpeedGameScene, playerManager : SpeedCardManager, cpuManager : SpeedCardManager, control : SpeedControl) : Promise<void>{
        console.log("check");
        scene.createDrag(playerManager);
        for(let i = 0; i < 2; ++i){
            const player : SpeedPlayer = this.players[i];
            // deckが空ではないとき、deckから台札へ
            if(!player.getDeck().isEmpty()){
                this.fieldCard[i] = player.getDeck().draw();
                if(i === 0){
                    playerManager.moveDeckToField(this.fieldCard[i]);
                }
                else{
                    cpuManager.moveDeckToField(this.fieldCard[i]);
                }
            }
            // deckが空の場合の処理
            else{
                const hand = player.getHand();
                const handLength = hand.length;
                let popCard = hand.pop();

                if(popCard !== undefined){
                    this.fieldCard[i] = popCard;
                }
                if(i === 0){
                    playerManager.moveHandToField(this.fieldCard[i], handLength, 0);
                }
                else{
                    cpuManager.moveHandToField(this.fieldCard[i], handLength, 1);
                }
            }
        }

        // 今回の台札のアップデートでゲームが進められるのか判定(2人の参加者のhandにfieldに重ねられるカードがあるか？)、参加者双方のhandに重ねられるカードがなければもう一度この関数を呼び出す。
        if(!this.isContinue()){
            console.log('re')
            await scene.createEventDisplay("Ready", 1000);
            this.updateFieldCard(scene, playerManager, cpuManager, control);
        }
        // 重ねられるカードがある場合
        // else {
        //     this.phase = "game";
        //     console.log('cpu move')
        //     this.players[1].cpuBehavior(this, scene, cpuManager);
        // }

    }

    // cardとfieldが重ねられるか判定。重ねられればtrue出来なければfalse
    public isOnCard(card : Card, field : Card) : boolean{
        // console.log(field);
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

    /*
    // cpuの手札から移動可能カードを見つけて移動アニメーションを起動するまで
    public moveCpuCard(scene : SpeedGameScene) : void{
        let cpu : SpeedPlayer = this.players[1];
        // 移動できるカードがあるか判定無ければreturn.あれば次の処理へ
        if(!cpu.hasOnTopCard(this)){
            return;
        }
        let moveIndex : number[] = cpu.getOnTopCardIndexAndField(this);

        scene

        // 移動のアニメーション おそらく起動するのに移動先の台札と移動させる手札の入力が必要なはずなのでmoveIndexを使って入れる
    }
    */

    // カードを手札から台札へ移動する裏の処理を実行する関数。ゲームの再開時ではなく、playの流れの中で使う。
    public moveCardHandToField(fieldIndex : number, cardIndex : number, player : SpeedPlayer, manager : SpeedCardManager, scene : SpeedGameScene) : void{
        // fieldの書き換え
        this.fieldCard[fieldIndex] = player.getHand()[cardIndex];
        let old : Phaser.GameObjects.Image = scene.getFieldCard()[fieldIndex];
        if(player.getType() === "CPU"){
            scene.getFieldCard()[fieldIndex] = scene.getCpuHand()[cardIndex];
        }
        else{
            scene.getFieldCard()[fieldIndex] = scene.getPlayerHand()[cardIndex];
        }
        scene.getFieldCard()[fieldIndex].setDepth(3);
        old.destroy();
        const deck : Deck = player.getDeck();

        // handへのdeckからの追加
        if(!deck.isEmpty()){
            let card : Card = deck.draw();
            player.getHand()[cardIndex] = card;
            manager.moveDeckToHand(card, cardIndex);
        }
        // deckがなければfieldへ行ったカードのある場所にnull cardを入れる
        // 此処の処理は要検討 cardを入れずhandを縮小するのもあり
        else{
            player.getHand()[cardIndex] = new Card('null', 'null');
        }
        if(player.getType() === "CPU") this.canCpuAction = true;

        // この行動によって勝利条件を満たしたかを判定する。勝利していた場合、そのプレイヤーのtypeによって別の処理をする。
        if(player.isComplete()){
            if(player.getType() === "CPU"){
                // プレイヤーが負けた画面の表示 and gameのstop
            }
            else{
                // プレイヤーが勝った画面表示 and gameのstop
            }
        }
        else{
            if(!this.isContinue){
                this.updateFieldCard(scene, )
            }
            if(this.canCpuAction) this.players[1].cpuBehavior(this, scene, manager);
        }
    }

    // cpu手札から台札にカードを移動する関数
    /*
    cpuの手札から台札に移動するカードを見つける関数
    この関数がカードを見つければカードを移動させるviewが起動する
    viewのアニメーションが完了して時点でthis.isOnCardを起動してtrueなら裏の処理としてカードを移動させる
    手札に移動可能カードがあるか判定 -> true -> 移動させるカードを見つける -> 移動アニメーション -> アニメーション終了時にthis.isOnCard()を起動その移動が有効か判定(アニメーションの完了までにプレイヤーが場札を上書きしている可能性があるため) -> true -> 裏の移動処理をする、viewの場札も変更 -> cpu待機状態へ -> この流れの最初に戻る
    */
}