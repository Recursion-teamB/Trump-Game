export class Card{
    private suit : string;
    private number : string;
    private img : string;
    private phaserImage: Phaser.GameObjects.Image | null;
    constructor(suit : string, number : string){
        this.suit = suit;
        this.number = number;
        this.img = `${suit}${Deck.getValueList().indexOf(this.number) + 1}`;
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
    public createPhaserImg(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Image {
        this.phaserImage = scene.add.image(x, y, this.img);
        return this.phaserImage;
    }
}

export class Deck{
    private deck : Card[] = [];
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["s", "d", "h", "c"];

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