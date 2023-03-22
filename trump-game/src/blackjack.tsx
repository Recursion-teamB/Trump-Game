import {Card, Deck, Player, Table} from './general'

export class BlackJackPlayer extends Player{
    private latch : number;

    constructor(name : string, type : string, latch : number){
        super(name, type);
        this.score = 40000;
        this.latch = latch;
    }

    public getLatch() : number{
        return this.latch;
    }
    public setLatch(value : number) : void{
        this.latch = value;
    }

    public bet(cost: number) : number{
        if(this.score >= cost){
            this.setScore(this.getScore()-cost);
            this.setLatch(cost);
        }

        return cost;
    }
}

export class BlackJackTable extends Table{
    private house : Player = new Player("House", "House");
    private roundNumber : number = 1;
    private turnNumber : number = 0;
    private phase : string = "betting";
    private bets : number[] = [0, 0, 0];
    protected players : BlackJackPlayer[];

    constructor(player: BlackJackPlayer){
        super();
        // 仮置き
        this.players = [new BlackJackPlayer("CPU1", "CPU", 40000), player, new BlackJackPlayer("CPU2", "CPU", 30000)];
    }

    public betTurn() : void{
        for(let i : number = 0; i < this.players.length; ++i){
            let current : BlackJackPlayer = this.players[i];
            if(current.getScore() === 0) continue;

            let bet : number = 0;
            if(current.getType() === "CPU"){
                bet = Math.random()*(1 - this.players[i].getScore()+1) + 1;
            }
            else {
                bet = 100 // プレイヤーからの入力を受け取る
                current.bet(bet);
            }
            this.bets[i] = bet;
            current.bet(bet)
        }
    }

    public getBets() : number[] {
        return this.bets;
    }

    public getPlayers() : BlackJackPlayer[] {
        return this.players;
    }
}
