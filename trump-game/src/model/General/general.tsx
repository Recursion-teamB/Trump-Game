export class Card{
    private suit : string;
    private number : string;
    private img : string;
    private phaserImage: Phaser.GameObjects.Image | null;
    constructor(suit : string, number : string){
        this.suit = suit;
        this.number = number;
        this.img = Deck.getImgMap()[this.suit][Deck.getValueList().indexOf(this.number)];
        this.phaserImage = null;
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
    public getPhaserImage() : Phaser.GameObjects.Image{
        if(this.phaserImage === null){
            throw new Error("PhaserImage is null");
        }
        return this.phaserImage;
    }
    createPhaserImg(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Image {
        this.phaserImage = scene.add.image(x, y, this.img);
        return this.phaserImage;
    }
}

export class Deck{
    private deck : Card[] = [];
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["♠︎", "♦︎", "♥︎", "♣︎"];
    private static imgMap : { [key: string]: string[] } = {
        "♠︎" : [
            "card_img/s1.png", "card_img/s2.png", "card_img/s3.png", "card_img/s4.png", "card_img/s5.png",
            "card_img/s6.png", "card_img/s7.png", "card_img/s8.png", "card_img/s9.png", "card_img/s10.png",
            "card_img/s11.png", "card_img/s12.png", "card_img/s13.png"
        ],
        "♦︎" : [
            "card_img/d1.png", "card_img/d2.png", "card_img/d3.png", "card_img/d4.png", "card_img/d5.png",
            "card_img/d6.png", "card_img/d7.png", "card_img/d8.png", "card_img/d9.png", "card_img/d10.png",
            "card_img/d11.png", "card_img/d12.png", "card_img/d13.png"
        ],
        "♥︎" : [
            "card_img/h1.png", "card_img/h2.png", "card_img/h3.png", "card_img/h4.png", "card_img/h5.png",
            "card_img/h6.png", "card_img/h7.png", "card_img/h8.png", "card_img/h9.png", "card_img/h10.png",
            "card_img/h11.png", "card_img/h12.png", "card_img/h13.png"
        ],
        "♣︎" : [
            "card_img/c1.png", "card_img/c2.png", "card_img/c3.png", "card_img/c4.png", "card_img/c5.png",
            "card_img/c6.png", "card_img/c7.png", "card_img/c8.png", "card_img/c9.png", "card_img/c10.png",
            "card_img/c11.png", "card_img/c12.png", "card_img/c13.png"
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
    public addHand(card : Card) : void{
        this.hand.push(card);
    }
    public getType() : string{
        return this.type;
    }
    public resetHand() : void {
        this.hand = [];
    }    
    //テストのみで使用すること
    public setHand(cardsForTest : Card[]) : void{
        this.hand = cardsForTest;
    }
}