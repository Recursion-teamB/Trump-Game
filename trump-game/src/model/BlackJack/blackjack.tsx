import {Deck, Player} from '../General/general'

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
        // if(this.getAction() !== ("" || "hit") || this.calcScore() > 20){
        if((this.getAction() !==  "" && this.getAction() !== "hit") || this.calcScore() > 20){
            return;
        }
        this.addHand(deck.draw());
        if(this.isBust()){
            this.setAction("bust");
        }

    }
    public stand() : void{
        if((this.getAction() !==  "" && this.getAction() !== "hit") || this.calcScore() >= 21){
            return;
        }
        this.setAction("stand")
    }
    //ほかのコマンドはコマンド選択画面をおした瞬間に起こるが, double()はdouble選択->掛金選択後に起こる.
    //掛金は0 < betMoney < this.getCost()
    public double(deck : Deck, betMoney : number) : void{
        if(this.getAction() !== ("") || this.calcScore() >= 21){
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
        if(this.getAction() !== ("") || this.calcScore() > 20){
            return;
        }
        this.addChips(this.getCost()/2)
        this.setAction("surrender")
    }
        //roundResultにはwin, draw, loseが入る. 手札が2枚で21かを判定する.
    //judgePerRound()メソッドで呼び出す.
    //賞金をchipsに追加し, costをリセットする.
    public winPrize(roundResult : string){
        if(roundResult === "win"){
            let isBlackJack : boolean = this.calcScore() === 21 && this.getHand().length === 2;
            let prize : number = isBlackJack ? this.getCost() * 2.5 : this.getCost() * 2;
            this.addChips(prize);
        }else if(roundResult === "draw"){
            this.addChips(this.getCost())
        }
        this.setCost(0)
    }

}

export class BlackJackTable {
    private house : BlackJackPlayer = new BlackJackPlayer("House", "House");
    private roundNumber : number = 1;
    private turnNumber : number = 0; // 1に変更の可能性あり
    private phase : string = "betting"; // betting, deal, playerPhase, dealerPhaseなどに1roundの中で適宜変更される。不要なら削除もあり。
    private bets : number[] = [0, 0, 0]; // 仮置き
    protected players : BlackJackPlayer[];
    private deck : Deck = new Deck();

    constructor(player: BlackJackPlayer){
        // 仮置き
        this.players = [player, new BlackJackPlayer("CPU1", "CPU"), new BlackJackPlayer("CPU2", "CPU")];
        this.deck.shuffle();
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

    public getTurnNumber() : number {
        return this.turnNumber;
    }
    public setTurnNumber(turnNumber : number) : void {
        this.turnNumber = turnNumber;
    }

    // ゲームの参加者が掛け金をベットするときの処理。CPUはランダムに、人間のplayerは入力を受け取って掛け金を決める。
    // this.betsの値と各参加者のchipが掛け金分減り、costが掛け金と同値になる。
    // chipsが0以下なら順番がスルーされる。
    public betPhase(playerBetAmount : number) : void{
        for(let i : number = 0; i < this.players.length; ++i){
            let current : BlackJackPlayer = this.players[i];
            if(current.getChips() === 0) continue;

            let bet : number = 0;
            if(current.getType() === "CPU"){
                bet = Math.floor(Math.random()*(this.players[i].getChips()+1 - 1) + 1);
                console.log('CPUs bet amount', bet);
            }
            else {
                bet = playerBetAmount // プレイヤーからの入力を受け取る
            }
            current.bet(bet);
            this.bets[i] = bet;
        }
    }

    // ディーラーフェイズ houseの手札のスコアが16以下ならhitしループ、 17以上ならフェイズ終了
    public async dealerPhase(): Promise<void> {
        this.phase = "dealer phase";
        // renderDealerPhase() ディーラーフェイズの画面出力
        while (this.house.calcScore() <= 16) {
            // hitを遅延させる
            await Promise.all([
                new Promise(resolve => setTimeout(resolve, 2000)),
                // renderDealerHit() ディーラーがヒットする画面出力
                this.house.hit(this.deck)
            ]);
            if (this.house.isBust()) {
                this.house.setAction("bust");
            }
        }
    }
    //ゲーム開始時に各プレイヤーにデッキから手札を2枚ずつ配る
    public distributeCards() : void{
        for(let player of this.players){
            for(let numOfCards = 0; numOfCards < 2; numOfCards++){
                player.addHand(this.deck.draw());
            }
        }
        this.house.addHand(this.deck.draw());
        this.house.addHand(this.deck.draw());
    }

    
    public judgePerRound() : void{
        const dealerScore = this.house.calcScore()
        let result = ""
        const judge = (num1 : number, num2 : number) => {
            if(num1 > num2){
                return "win"
            }else if(num1 === num2){
                return "draw"
            }else{
                return "lose"
            }
        }
        for(const player of this.players){
            if(player.getAction() === "surrender" || player.getAction() === "bust"){
                result = "lose"
            }else if(this.house.getAction() === "bust"){
                result = "win"
            }else{
                result = judge(player.calcScore(),dealerScore)
            }
            player.winPrize(result)
        }
    }

    public getPhase(){
        return this.phase;
    }
}

