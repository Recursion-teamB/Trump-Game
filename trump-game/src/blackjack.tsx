import {Card, Deck, Player} from './general'

export class BlackJackPlayer extends Player{
    private latch : number;
    private chips : number;

    constructor(name : string, type : string){
        super(name, type);
        this.latch = 0;
        this.chips = 40000;
    }

    public getLatch() : number{
        return this.latch;
    }
    public setLatch(value : number) : void{
        this.latch = value;
    }
    public getChips() : number{
        return this.chips;
    }
    public setChips(chip : number) : void{
        this.chips = chip
    }
    public addChips(chip : number) : number{
        this.chips += chip;
        return this.chips;
    }

    // 掛け金をかける。cost <= this.chipsならばthis.chipsが入力分減り、this.latchにセットされる。cost > this.chipsなら何も処理されない。
    public bet(cost: number) : void{
        if(this.chips >= cost){
            this.setChips(this.getChips()-cost);
            this.setLatch(cost);
        }
    }
    //プレイヤーの手札の合計を計算するメソッド
    //JQKは10として加算
    //Aceは1, 11の都合の良い方で加算
    public calcScore() : number{
        let currentScore : number = 0;
        let hasAce : boolean = false;
        for(let card of this.hand){
            //CardValueの上限を10に設定
            let cardValue = Math.min(card.getValue(), 10);
            //とりあえずAceは1として後で調整
            if(cardValue === 1){
                hasAce = true;
            }
            currentScore += cardValue;
        }
        //Aceが手札にあり、かつ現在の合計値が11未満の場合はAceを11と扱う
        if(hasAce && currentScore < 11){
            currentScore += 10;
        }
        return currentScore; 
    }
    //プレイヤーのカードの合計値が22以上の場合バスト
    public isBust() : boolean{
        let totalValue : number = 0;
        for(let card of this.hand){
            let cardValue = card.getValue();
            //cardValueの上限を10に制御 -> JQKが10になるように制御
            totalValue += Math.min(cardValue, 10);
            //合計値が22以上で即座にbust
            if(totalValue >= 22) return true;
        }
        return false;
    }
}

export class BlackJackTable {
    private house : Player = new Player("House", "House");
    private roundNumber : number = 1;
    private turnNumber : number = 0; // 1に変更の可能性あり
    private phase : string = "betting"; // betting, dear, playerPhase, dealerPhaseなどに1roundの中で適宜変更される。不要なら削除もあり。
    private bets : number[] = [0, 0, 0]; // 仮置き
    protected players : BlackJackPlayer[];
    private deck : Deck;

    constructor(player: BlackJackPlayer){
        // 仮置き
        this.players = [new BlackJackPlayer("CPU1", "CPU"), player, new BlackJackPlayer("CPU2", "CPU")];
        this.deck = new Deck();
    }

    public getBets() : number[] {
        return this.bets;
    }

    public getPlayers() : BlackJackPlayer[] {
        return this.players;
    }

    // ゲームの参加者が掛け金をベットするときの処理。CPUはランダムに、人間のplayerは入力を受け取って掛け金を決める。
    // this.betsの値と各参加者のchipが掛け金分減り、latchが掛け金と同値になる。
    // chipsが0以下なら順番がスルーされる。
    public betPhase() : void{
        for(let i : number = 0; i < this.players.length; ++i){
            let current : BlackJackPlayer = this.players[i];
            if(current.getChips() === 0) continue;

            let bet : number = 0;
            if(current.getType() === "CPU"){
                bet = Math.random()*(this.players[i].getChips()+1 - 1) + 1;
            }
            else {
                bet = 100 // プレイヤーからの入力を受け取る
                current.bet(bet);
            }
            this.bets[i] = bet;
            current.bet(bet)
        }
    }
}

