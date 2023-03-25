export class Card{
    private suit : string;
    private number : string;
    private img : string;
    constructor(suit : string, number : string){
        this.suit = suit;
        this.number = number;
        this.img = Deck.getImgMap()[this.suit][Deck.getValueList().indexOf(this.number)];
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
    public getImg() : string{
        return this.img;
    }
}

export class Deck{
    private deck : Card[] = [];
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["♠︎", "♦︎", "♥︎", "♣︎"];
    private static imgMap : { [key: string]: string[] } = {
        "♠︎" : [
            "./src/s1.png", "./src/s2.png", "./src/s3.png", "./src/s4.png", "./src/s5.png",
            "./src/s6.png", "./src/s7.png", "./src/s8.png", "./src/s9.png", "./src/s10.png",
            "./src/s11.png", "./src/s12.png", "./src/s13.png"
        ],
        "♦︎" : [
            "./src/d1.png", "./src/d2.png", "./src/d3.png", "./src/d4.png", "./src/d5.png",
            "./src/d6.png", "./src/d7.png", "./src/d8.png", "./src/d9.png", "./src/d10.png",
            "./src/d11.png", "./src/d12.png", "./src/d13.png"
        ],
        "♥︎" : [
            "./src/h1.png", "./src/h2.png", "./src/h3.png", "./src/h4.png", "./src/h5.png",
            "./src/h6.png", "./src/h7.png", "./src/h8.png", "./src/h9.png", "./src/h10.png",
            "./src/h11.png", "./src/h12.png", "./src/h13.png"
        ],
        "♣︎" : [
            "./src/c1.png", "./src/c2.png", "./src/c3.png", "./src/c4.png", "./src/c5.png",
            "./src/c6.png", "./src/c7.png", "./src/c8.png", "./src/c9.png", "./src/c10.png",
            "./src/c11.png", "./src/c12.png", "./src/c13.png"
        ]
    }
    constructor(){
        this.deck = this.createDeck();
    }   

    //52枚のカードをデッキに入れるメソッド
    public createDeck() : Card[]{
        let tempDeck : Card[] = [];
        for(let suit of Deck.suitList){
            for(let value of Deck.valueList){
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
    public static getImgMap() : { [key: string]: string[] }{
        return Deck.imgMap;
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