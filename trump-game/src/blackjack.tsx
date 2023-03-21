import {Card, Deck, Player, Table} from './general'

export class BlackJackPlayer extends Player{

}

export class BlackJackTable extends Table{
    house : Player;
    roundNumber : number;
    turnNumber : number;
    phase : string;
    bets : number[];
}
