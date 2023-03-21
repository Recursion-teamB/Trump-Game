export class Card{
    private suit : string;
    private number : string;
    private valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

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
        return this.valueList.indexOf(this.number) + 1;
    }
}

export class Deck{

}

export class Player{
    protected name : string;
    protected type : string;
    protected hand : Card[];
    protected score : number;

    constructor(name : string, type : string){
        this.name = name;
        this.type = type;
        this.score = 0;
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
    public getScore() : number{
        return this.score;
    }
    public setScore(score : number) : void{
        this.score = score;
    }
    public addScore(score : number) : void{
        this.score += score;
    }
}

export class Table{
    protected players : Player[];
    constructor(players : Player[]){
        this.players = players;

    }
}
