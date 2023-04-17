import { Player, Card, Deck } from "../General/general";

export class WarPlayer extends Player{
    //獲得したカードの枚数
    private score: number;
    //手札から選んだカード
    private chosenCard: Card | null = null;
    constructor(name: string, type: string){
        super(name, type);
        this.score = 0;
    }
    public getScore(): number{
        return this.score;
    }
    public setScore(score: number): void{
        this.score = score;
    }
    public addScore(score: number): void{
        this.score += score;
    }
    public chooseCard(index : number) : void{
        this.chosenCard = this.hand[index];
        this.hand.splice(index, 1);
    }
    public getChosenCard(): Card | null{
        return this.chosenCard;
    }
    public resetChosenCard(): void{
        this.chosenCard = null;
    }
}

export class WarTable{
    private players: WarPlayer[];
    //デッキ自体はWarゲーム内では見えないが、カードを配るためにロジック側で用意する
    private deck: Deck = new Deck();
    //盤面に出されたカード。得点可能なカードの数となる
    private cards : Card[] = [];
    constructor(player: WarPlayer){
        this.players = [player, new WarPlayer("CPU", "CPU")];
        this.deck.shuffle();
    }
    public getPlayers(): WarPlayer[]{
        return this.players;
    }
    public distributeCards(): void{
        for(let player of this.players){
            for(let i = 0; i < 26; i++){
                player.addHand(this.deck.draw());
            }
        }
    }
    public addCards(card: Card): void{
        this.cards.push(card);
    }
    //カード比較後、決着がついた場合盤面のカードをリセットする
    public resetCards() : void{
        this.cards = [];
    }
    //カード比較後、決着がついた場合、各プレイヤーの選んだカードをリセットする
    public resetAllChosenCards(): void{
        for(let player of this.players){
            player.resetChosenCard();
        }
    }

    public judgeWinner(players : WarPlayer[]): string{
        if(players[0].getChosenCard() === null || players[1].getChosenCard() === null){
            throw new Error("Player has not chosen card yet");
        }
        if(players[0].getChosenCard()!.getRank() === players[1].getChosenCard()!.getRank()){
            return "draw";
        }
        else if(players[0].getChosenCard()!.getRank() > players[1].getChosenCard()!.getRank()){
            return "player";
        }
        else{
            return "cpu";
        }
    }
    public reflectScore(winner: string): void{
        if(winner === "player"){
            this.players[0].addScore(this.cards.length);
            this.resetCards();
        }
        else if(winner === "cpu"){
            this.players[1].addScore(this.cards.length);
            this.resetCards();
        }
        else{
            //引き分けの場合は次の比較に持ち越されるため得点は加算しない
            //引き分けの場合は盤面のカードをリセットしない
        }
        //勝敗関係なく次の比較を行うため、「現在選んでいるカード」をリセットする
        this.resetAllChosenCards();
    }
    public playRound(playerCardIndex: number): string {
        this.players[0].chooseCard(playerCardIndex);
        const cpuCardIndex = Math.floor(Math.random() * this.players[1].getHand().length);
        this.players[1].chooseCard(cpuCardIndex);

        for (const player of this.players) {
            //選んだカードを盤面に出す
            this.addCards(player.getChosenCard() as Card);
        }

        const winner = this.judgeWinner(this.players);
        this.reflectScore(winner);
        return winner;
    }

    public isGameOver(): boolean {
        return this.players[0].getHand().length === 0 || this.players[1].getHand().length === 0;
    }

    public getGameResult(): string {
        const playerScore = this.players[0].getScore();
        const cpuScore = this.players[1].getScore();

        if (playerScore > cpuScore) {
            return "Player wins!";
        } else if (playerScore < cpuScore) {
            return "CPU wins!";
        } else {
            return "It's a draw!";
        }
    }
}


// terminalだけで遊ぶ場合
// const player = new WarPlayer("Player", "Human");
// const warTable = new WarTable(player);

// warTable.distributeCards();

// while (!warTable.isGameOver()) {
//     const playerCardIndex = 1//画面から選択したカードのindex。今回は適当に1を入れている
//     warTable.playRound(playerCardIndex);
// }

// console.log(warTable.getGameResult());
