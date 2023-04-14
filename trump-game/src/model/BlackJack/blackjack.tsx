import {Deck, Player} from '../General/general'
import BlackGameScene from '../../scene/BlackJack/BlackGame'

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
        this.setAction('hit');
        if(this.calcScore() === 21){
            this.setAction("BlackJack");
        }
        console.log('hit');
        if(this.isBust()){
            this.setAction("bust");
        }

    }
    public stand() : void{
        if((this.getAction() !==  "" && this.getAction() !== "hit") || this.calcScore() >= 21){
            return;
        }
        this.setAction("stand")
        console.log('stand');
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
            console.log('double');
            if(this.isBust()){
                this.setAction("bust");
            }else if(this.calcScore() === 21){
                this.setAction("BlackJack");
            }else{
                this.setAction("stand");
            }
        }
    }
    public surrender() :void{
        if(this.getAction() !== ("") || this.calcScore() > 20){
            return;
        }
        this.addChips(this.getCost()/2)
        this.setAction("surrender")
        console.log('surrender');
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

    public changeTurnNumber() : void {
        if(this.turnNumber >= this.players.length-1) {
            this.turnNumber = 0;
        }
        else ++this.turnNumber;
    }

    // ゲームの参加者が掛け金をベットするときの処理。CPUはランダムに、人間のplayerは入力を受け取って掛け金を決める。
    // this.betsの値と各参加者のchipが掛け金分減り、costが掛け金と同値になる。
    // chipsが0以下なら順番がスルーされる。
    public betPhase(scene : BlackGameScene, amount : number) : void {
        if(this.completeBet()){
            this.distributeCards(scene);
            return;
        }

        let current : BlackJackPlayer = this.players[this.getTurnNumber()];
        if(current.getChips() === 0){
            this.changeTurnNumber();
        }
        if(current.getType() === "CPU"){
            amount = this.getRandomInt(1, current.getChips()+1);
            current.bet(amount);
            scene.updateChips(this);
            this.changeTurnNumber();
            // scene.renderBet() 的なやつを起動する。
            scene.updateChips(this);
            this.betPhase(scene, 0);
        }
        else{
            console.log("check3");
            current.bet(amount);
            this.changeTurnNumber();
        }
    }

    completeBet() : boolean {
        if(this.phase !== 'betting'){
            return false;
        }

        for(let player of this.players){
            if(player.getChips() !== 0 && player.getCost() === 0){
                return false;
            }
        }
        return true;
    }

    // 必要なくなった。
    // public betPhase(playerBetAmount : number) : void{
    //     for(let i : number = 0; i < this.players.length; ++i){
    //         let current : BlackJackPlayer = this.players[i];
    //         if(current.getChips() === 0) continue;

    //         let bet : number = 0;
    //         if(current.getType() === "CPU"){
    //             bet = Math.floor(Math.random()*(this.players[i].getChips()+1 - 1) + 1);
    //             console.log('CPUs bet amount', bet);
    //         }
    //         else {
    //             bet = playerBetAmount // プレイヤーからの入力を受け取る
    //         }
    //         current.bet(bet);
    //         this.bets[i] = bet;
    //     }
    // }

    // ディーラーフェイズ houseの手札のスコアが16以下ならhitしループ、 17以上ならフェイズ終了
    public async dealerPhase(): Promise<void> {
        console.log("dealer Phase")
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
        // this.judgeWinOrLose(); 勝敗判定のフェイズへ移動
    }

    //ゲーム開始時に各プレイヤーにデッキから手札を2枚ずつ配る
    public async distributeCards(scene : BlackGameScene) : Promise<void>{
        for(let i = 0; i < 2; ++i){
            for(let j = 0; j < 3; ++j){
                let current : BlackJackPlayer = this.players[j];
                await Promise.all([
                    new Promise(resolve => setTimeout(resolve, 650)),
                    current.addHand(this.deck.draw()),
                    scene.updatePlayerScore(j, current),
                ]);
                if(current.calcScore() === 21){
                    current.setAction("BlackJack");
                }
            }
        }

        this.house.addHand(this.deck.draw());
        this.house.addHand(this.deck.draw());
        for(let player of this.players){
            console.log(player.getHand());
        }

        this.turnNumber = 0;
        this.actionPhase(scene);
    }

    public judgeWinOrLose() : string[]{
        return ["win","win","win"]
    }

    public getPhase(){
        return this.phase;
    }

    // プレイヤーが行動するフェイズ
    // public async actionPhase(scene: BlackGameScene) : Promise<void>{
    public async actionPhase(scene: BlackGameScene) : Promise<void>{
        this.phase = 'action';
        console.log(this.players[this.turnNumber].getName() + ' : ' + this.players[this.turnNumber].getType() +  " : " + this.players[this.turnNumber].getAction());
        if(this.completeAction()){
            console.log("action complete");
            this.dealerPhase();
            return;
        }
        if(this.turnNumber >= this.players.length){
            this.turnNumber = 0;
        }
        let current : BlackJackPlayer = this.players[this.turnNumber];

        // 行動出来ないプレイヤーをスルーする処理
        if(current.getAction() === "stand" || current.getAction() === "surrender" || current.getAction() === "BlackJack") {
            console.log("check");
            this.changeTurnNumber();
            this.actionPhase(scene);
            return;
        }

        if(current.getType() === "CPU"){
            await Promise.all([
                new Promise(resolve => setTimeout(resolve, 1000)),
                this.cpuAction(current),
                scene.updatePlayerScore(this.turnNumber, current),
                scene.updatePlayerAction(this.turnNumber, current),
                this.changeTurnNumber(),
            ]);
            this.actionPhase(scene);
            return;
        }
        else{
            scene.showActionPopUp(this);
            return;
        }



        // console.log("check");
        // let flag : boolean = true;

        // while(flag){
        //     flag = false;
        //     let playersLength : number = this.players.length;

        //     for(let i = 0; i < playersLength; ++i){
        //         let current : BlackJackPlayer = this.players[i];
        //         // cpu
        //         if(current.getType() === "CPU"){
        //             await Promise.all([
        //                 new Promise(resolve => setTimeout(resolve, 2000)),
        //                 this.cpuAction(current),
        //                 console.log(current.getName() + " score :" + current.calcScore()),
        //             ]);
        //         }
        //         // 人間
        //         else{
        //             // プレイヤーからactionを取得するレンダーとコントロール
        //             await scene.showActionPopUp(this);
        //             console.log(current.getName() + " score :" + current.calcScore());
        //         }
        //         if(current.getAction() === "hit") flag = true;
        //     }
        // }
        // await this.dealerPhase();
    }

    // 参加者全員のactionが終わっているとtrueまだ残っているとfalse;
    private completeAction() : boolean{
        if(this.phase !== "action"){
            return false;
        }

        for(let i = 0; i < this.players.length; ++i){
            let pStatus = this.players[i].getAction();
            if(pStatus !== "stand" && pStatus !== "bust" && pStatus !== "BlackJack" && pStatus !== 'broke'){
                return false;
            }
        }
        return true;
    }

    // cpuのhitやstandなどのアクションを決定する関数
    public cpuAction(cpu : BlackJackPlayer) : void {
        let score : number = cpu.calcScore()
        // 1ターン目の判定
        if(cpu.getAction() === ""){
            // スコア11で1ターン目なら確定double
            if(score === 11){
                cpu.double(this.deck, this.getRandomInt(1, cpu.getCost()+1));
                return;
            }
            // スコア10で1ターン目なら半々でhitかdouble
            else if(score === 10){
                if(this.getRandomInt(0, 2) === 1){
                    cpu.double(this.deck, this.getRandomInt(1, cpu.getCost()+1));
                    return;
                }
                else{
                    cpu.hit(this.deck);
                    return;
                }
            }
        }

        // 2ターン目以降でスコア12以下なら確定でhit
        if(score <= 12){
            cpu.hit(this.deck);
            return;
        }

        // スコアが17以上なら確定でstand
        if(score <= 17){
            cpu.stand();
            return;
        }

        // 13 <= score < 17 でhouseのアップカードのスコアが7以上ならhit,7未満ならstand
        if(this.house.getHand()[0].getRank() >= 7 || this.house.getHand()[0].getRank() === 1){
            cpu.hit(this.deck);
            return;
        }
        else{
            cpu.stand();
            return;
        }
    }

    // 返り値をnとして min <= n < max の範囲のランダムな整数値を返す。
    public getRandomInt(min : number, max : number) : number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}

