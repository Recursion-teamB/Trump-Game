import { SpeedGameScene } from '../../scene/Speed/SpeedGame';
import { Deck, Player } from '../General/general'
import { SpeedTable } from './SpeedTable';

export class SpeedPlayer extends Player {
    private deck : Deck;
    constructor(name : string, type : string){
        super(name, type);
        if(this.type === "CPU"){
            this.deck = new Deck('red');
        }
        else{
            this.deck = new Deck('black');
        }
        this.deck.shuffle();
        }

    // ゲッター
    public getDeck() : Deck{
        return this.deck;
    }
    public getDeckLength() : number{
        return this.deck.getDeck().length;
    }


    // 場札に重ねられるカードがあるかを判定する重ねられるカードがあればtrue無ければfalse
    public hasOnTopCard(table : SpeedTable) : boolean{
        for(let fieldCard of table.getFieldCard()){
            for(let card of this.hand){
                if(table.isOnCard(card, fieldCard)){
                    return true;
                }
            }
        }
        return false;
    }

    // 重ねられる台札と手札のindexを取得する
    public getOnTopCardIndexAndField(table : SpeedTable) : number[] {
        for(let i = 0; i < 2; ++i){
            let handLength = this.hand.length;
            let fieldCard = table.getFieldCard()[i]
            for(let j = 0; j < handLength; ++j){
                let card = this.hand[j];
                if(table.isOnCard(card, fieldCard)){
                    return [i, j];
                }
            }
        }
        return [];
    }

    public countValid() : number{
        let count = 0;
        for(let card of this.hand){
            if(card.getSuit() !== "null") ++count;
        }
        return count;
    }

    // 有効な手札があるか判定、手札の長さを保ちたいので追加できない場合nullを入れたCardを追加しているがそれを除いた時に手札があるのか検査する。
    public isNoValid() : boolean{
        for(let card of this.hand){
            if(card.getSuit() !== "null") return false;
        }
        return true;
    }

    public isComplete() : boolean{
        if(this.isNoValid() && this.deck.isEmpty()){
            return true;
        }
        return false;
    }

    // cpuの動きを実装する関数
    // cpuの手札から移動可能カードを見つけて移動アニメーションを起動するまで
    public async cpuBehavior(table : SpeedTable, scene : SpeedGameScene) : Promise<void>{
        // cpuのactionが別に呼び出されていないか判定falseなら呼び出されているので中断。
        if(!table.getCpuAction()) return;
        table.setCpuAction(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        // 移動できるカードがあるか判定、無ければreturn、あれば次の処理へ
        if(this.hasOnTopCard(table)){
            let index : number[] = this.getOnTopCardIndexAndField(table);
            scene.moveCpuHand(table.getFieldCard()[index[0]], index[1], index[0]);
        }
        else{
            console.log("none");
            table.setCpuAction(true);
            return;
        }
    }
}