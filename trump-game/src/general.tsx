export class Card{
    private suit : string;
    private number : string;

    constructor(suit : string, number : string){
        this.suit = suit;
        this.number = number;
    }

    public getSuit() : string{
        return this.suit;
    }
    public getNumber() : string{
        return this.number;
    }
    //カードのnumberを数字で返す
    public getRank() : number{
        return Deck.getValueList().indexOf(this.number) + 1;
    }
}

export class Deck{
    private deck : Card[] = [];
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["♠︎", "♦︎", "♥︎", "♣︎"];
    constructor(){
        this.deck = this.createDeck();
    }   

    //52枚のカードをデッキに入れるメソッド
    public createDeck() : Card[]{
        let tempDeck : Card[] = [];
        for(let suit in Deck.suitList){
            for(let value in Deck.valueList){
                tempDeck.push(new Card(suit, value));
            }
        }
        return tempDeck;    
    }
    //デッキの一番後ろからカードを1枚引く
    public draw() : Card{
        let drawnCard : Card  = this.deck[this.deck.length - 1];
        this.deck.pop();
        return drawnCard;
    }
    //デッキをランダムな順序に変更
    public shuffle() : void{
        for(let index = this.deck.length - 1; index > 0; index--){
            let randomIndex = Math.floor(Math.random() * (index + 1));
            let temp = this.deck[index];
            this.deck[index] = this.deck[randomIndex];
            this.deck[randomIndex] = temp;
        }
    }
    public static getValueList() : string[]{
        return Deck.valueList;
    }
    public static getSuitList() : string[]{
        return Deck.suitList;
    }
    public getDeck() : Card[]{
        return this.deck;
    }
}

export class Player{
    protected name : string;
    protected type : string;
    protected hand : Card[];
    
    constructor(name : string, type : string){
        this.name = name;
        this.type = type;
        this.hand = [];
    }

    public getName() : string{
        return this.name;
    }
    public getHand() : Card[]{
        return this.hand;
    }
    public getType() : string{
        return this.type;
    }
    //テストのみで使用すること
    public setHand(cardsForTest : Card[]) : void{
        this.hand = cardsForTest;
    }
}