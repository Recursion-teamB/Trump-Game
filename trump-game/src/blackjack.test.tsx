import {BlackJackPlayer, BlackJackTable} from './blackjack';


let player : BlackJackPlayer = new BlackJackPlayer("jack", "player", 30000);
let table : BlackJackTable = new BlackJackTable(player);

test("betTurnによってbetsが変更されている", () => {
  table.betTurn();
  const result = table.getBets();
	expect(result).not.toBe([0,0,0]);
});

test("プレイヤーに掛け金がセットされる", () =>{
  table.betTurn();
  const result = table.getPlayers()[1].getLatch();
  expect(result).toBe(100);
})

