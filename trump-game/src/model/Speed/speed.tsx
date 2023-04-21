import {Card, Deck, Player} from '../General/general'
export class SpeedPlayer extends Player {
    protected deck: SpeedDeck;

    constructor(name: string, type: string, deck: SpeedDeck) {
        super(name, type);
        this.deck = deck
    }
    /*
    public drawCard(): void {
        if (this.deck.length > 0) {
            const card = this.deck.pop();
            if (card) {
                this.addHand(card);
            }
        }
    }
    */
    public getDeck(): Deck{
        return this.deck
    }

    public setDeck(deck: SpeedDeck): void {
        this.deck = deck;
    }

    public playCard(table: SpeedTable, card: Card): boolean {
        const piles = table.getPiles();
        for (let i = 0; i < piles.length; i++) {
          if (this.canPlayCard([piles[i]])) {
            this.removeFromHand(card);
            table.addToPile(i, card);
            return true;
          }
        }
        return false;
      }

    private removeFromHand(card: Card): void {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
        }
    }
    public canPlayCard(tableCards: Card[]): boolean {
        for (const card of this.hand) {
          for (const tableCard of tableCards) {
            if (Math.abs(card.getRank() - tableCard.getRank()) === 1) {
              return true;
            }
          }
        }
        return false;
      }
}

export class SpeedTable {
    private piles: Card[];
    private players: SpeedPlayer[];

    constructor() {
        this.piles = [];
        this.players = [];
    }

    public getPiles(): Card[] {
        return this.piles;
    }

    public addToPile(pileIndex: number, card: Card): void {
        this.piles[pileIndex] = card;
    }
    /*
    public canPlayCard(pileIndex: number, card: Card): boolean {
        const pile = this.piles[pileIndex];

        if (!pile) {
            return true;
        }

        const topCardRank = pile.getRank();
        const cardRank = card.getRank();
        return (topCardRank + 1 === cardRank) || (topCardRank - 1 === cardRank);
    }
    */

    public addPlayer(player: SpeedPlayer): void {
        this.players.push(player);
    }

    public getPlayers(): SpeedPlayer[] {
        return this.players;
    }

    public getPlayer(index: number): SpeedPlayer {
        return this.players[index];
    }
    public canAnyPlayerPlay(): boolean {
        for (const player of this.players) {
          if (player.canPlayCard(this.piles)) {
            return true;
          }
        }
        return false;
      }
    
}

export class SpeedCpuPlayer extends SpeedPlayer {
    constructor(name: string, deck: SpeedDeck) {
        super(name, 'cpu', deck);
    }

    public playTurn(table: SpeedTable): boolean {
        const hand = this.getHand();
        for (const card of hand) {
            if (this.playCard(table, card)) {
                return true;
            }
        }
        return false;
    }
}

export class SpeedDeck extends Deck{
    constructor(){
        super()
    }

    //二つのデッキを作成し, 配列で返す
    public static makeDevidedDeck(deck : Deck) : SpeedDeck[]{
        const playerCards : Card[]= deck.getDeck().splice(0,26)
        const cpuCards : Card[] = deck.getDeck()
        let decks : SpeedDeck[] = []
        const playerDeck = new SpeedDeck()
        const cpuDeck = new SpeedDeck()
        playerDeck.setDeck(playerCards)
        cpuDeck.setDeck(cpuCards)

        decks[0] = playerDeck
        decks[1] = cpuDeck
        return decks
    }

    public setDeck(cards : Card[]): void{
        this.deck = cards
    } 
}