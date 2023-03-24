import {BlackJackPlayer, BlackJackTable} from './blackjack';


let player : BlackJackPlayer = new BlackJackPlayer("jack", "player");
let table : BlackJackTable = new BlackJackTable(player);

test("betPhase()によってbetsが変更されている", () => {
  table.betPhase();
  const result = table.getBets();
	expect(result).not.toBe([0,0,0]);
});

test("プレイヤーに掛け金がセットされる", () =>{
  table.betPhase();
  const result = table.getPlayers()[1].getLatch();
  expect(result).toBe(100);
})

