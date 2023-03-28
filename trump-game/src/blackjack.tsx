import {Card, Deck, Player} from './general'

export class BlackJackPlayer extends Player{
    private chips : number;
    private cost : number;
    private action : string;

    constructor(name : string, type : string){
        super(name, type);
        this.chips = 40000;
        this.cost = 0;
        this.action = "";
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
    public getCost() : number{
        return this.cost;
    }
    public setCost(cost : number) : void{
        this.cost = cost
    }

    // CardかCard[]を引数としthis.handに追加する。
    public setHand(card : Card): void;
    public setHand(cards : Card[]): void;
    public setHand(card : Card | Card[]) : void{
        if(Array.isArray(card)){
            this.hand.concat(card);
        }
        else this.hand.push(card);
    }

    public getAction() : string{
        return this.action
    }
    public setAction(action :string) : void{
        this.action = action
    }

    // 掛け金をかける。cost <= this.chipsならばthis.chipsが入力分減り、this.costにセットされる。cost > this.chipsなら何も処理されない。
    public bet(cost: number) : void{
        if(this.chips >= cost){
            this.setCost(cost)
            this.setChips(this.getChips()-this.getCost());
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
            let cardValue = Math.min(card.getRank(), 10);
            //とりあえずAceは1として後で調整
            if(cardValue === 1){
                hasAce = true;
            }
            currentScore += cardValue;
        }
        //Aceが手札にあり、かつ現在の合計値が11以下の場合はAceを11と扱う
        if(hasAce && currentScore <= 11){
            currentScore += 10;
        }
        return currentScore;
    }
    //プレイヤーのカードの合計値が22以上の場合バスト
    public isBust() : boolean{
        let totalValue : number = 0;
        for(let card of this.hand){
            let cardValue = card.getRank();
            //cardValueの上限を10に制御 -> JQKが10になるように制御
            totalValue += Math.min(cardValue, 10);
            //合計値が22以上で即座にbust
            if(totalValue >= 22) return true;
        }
        return false;
    }

    //スコアが21未満のときかつactionの値がhitまたはstandのときにコマンド選択可能.
    //actionのデフォルトはhitでhit,stand,double,surrenderによって書き換えられる.
    public hit(deck : Deck) :void{
        if(this.getAction() != ("" || "hit") || this.calcScore() > 20){
            return;
        }
        this.addHand(deck.draw());
        if(this.isBust()){
            this.setAction("bust");
        }
    }
    public stand() : void{
        if(this.getAction() != ("" || "hit") || this.calcScore() > 20){
            return;
        }
        this.setAction("stand")
    }
    //ほかのコマンドはコマンド選択画面をおした瞬間に起こるが, double()はdouble選択->掛金選択後に起こる.
    //掛金は0 < betMoney < this.getCost()
    public double(deck : Deck, betMoney : number) : void{
        if(this.getAction() != ("") || this.calcScore() > 20){
            return;
        }
        if(betMoney > 0 && betMoney <= this.getCost()){
            this.addChips(0 - betMoney)
            this.setCost(this.getCost() + betMoney)
            this.addHand(deck.draw())
            if(this.isBust()){
                this.setAction("bust");
            }else{
                this.setAction("stand")
            }
        }
    }
    public surrender() :void{
        if(this.getAction() != ("") || this.calcScore() > 20){
            return;
        }
        this.addChips(this.getCost()/2)
        this.setCost(0)
        this.setAction("surrender")
    }
}

export class BlackJackTable {
    private house : BlackJackPlayer = new BlackJackPlayer("House", "House");
    private roundNumber : number = 1;
    private turnNumber : number = 0; // 1に変更の可能性あり
    private phase : string = "betting"; // betting, deal, playerPhase, dealerPhaseなどに1roundの中で適宜変更される。不要なら削除もあり。
    private bets : number[] = [0, 0, 0]; // 仮置き
    protected players : BlackJackPlayer[];
    private deck : Deck;

    constructor(player: BlackJackPlayer){
        // 仮置き
        this.players = [new BlackJackPlayer("CPU1", "CPU"), player, new BlackJackPlayer("CPU2", "CPU")];
        this.deck = new Deck();
    }

    public getDeck() : Deck{
        return this.deck;
    }
    public getBets() : number[] {
        return this.bets;
    }

    public getPlayers() : BlackJackPlayer[] {
        return this.players;
    }

    public getHouse() : BlackJackPlayer {
        return this.house;
    }

    // ゲームの参加者が掛け金をベットするときの処理。CPUはランダムに、人間のplayerは入力を受け取って掛け金を決める。
    // this.betsの値と各参加者のchipが掛け金分減り、costが掛け金と同値になる。
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

    // commandが実装され次第完成させる今は未完成
    public dealerPhase() : void{
        while(this.house.calcScore() <= 16){
            // 2秒遅れてhit
            /*
            setTimeout(() => {
                this.house.hit() // hit仮置き
                renderDealerBet()
            }, 2000);
            */
        }
    }
    
    public judgeWinOrLose() : string[]{
        return ["win","win","win"]

    }
}

