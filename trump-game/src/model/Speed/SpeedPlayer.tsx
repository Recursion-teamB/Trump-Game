import { Card, Deck, Player } from '../General/general'
import { SpeedTable } from './SpeedTable';

export class SpeedPlayer extends Player {
    private handsNumber : number;
    private deck : Deck;
    constructor(name : string, type : string){
        super(name, type);
        this.handsNumber = 26;
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
    public getHandLength() : number{
        return this.handsNumber;
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

    public isComplete() : boolean{
        if(this.isEmptyHand() && this.deck.isEmpty()){
            return true;
        }
        return false;
    }
}