export class Card{
    private suit : string;
    private number : string;
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["♠︎", "♦︎", "♥︎", "♣︎"];

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
    public getValue() : number{
        return Card.valueList.indexOf(this.number) + 1;
    }
    public static getValueList() : string[]{
        return Card.valueList;
    }
    public static getSuitList() : string[]{
        return Card.suitList;
    }
}

export class Deck{
    private deck : Card[] = [];
    constructor(){
        for(let suit in Card.getSuitList()){
            for(let value in Card.getValueList()){
                this.deck.push(new Card(suit, value));
            }
        }    
    }
    //デッキの一番後ろからカードを1枚引く
    public draw() : Card{
        let drawnCard : Card  = this.deck[this.deck.length - 1];
        this.deck.pop();
        return drawnCard;
    }

    public shuffle() : void{
        for(let index = this.deck.length - 1; index > 0; index--){
            let randomIndex = Math.floor(Math.random() * (index + 1));
            let temp = this.deck[index];
            this.deck[index] = this.deck[randomIndex];
            this.deck[randomIndex] = temp;
        }
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
}

// export class Table{
//     protected players : Player[];
//     protected deck : Deck;

//     constructor(players : Player[]){
//         this.players = players;
//         this.deck = new Deck();
//     }
// }
