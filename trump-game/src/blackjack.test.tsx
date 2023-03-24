import {BlackJackPlayer, BlackJackTable} from './blackjack';
import { Card } from './general';


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

// test("ディーラーがヒットする場合", () => {
//   let house = table.getHouse()
//   house.setHand(new Card("spade", "4"));
//   house.setHand(new Card("spade", "6"));
//   table.dealerPhase();
//   const result = house.calcScore();
//   expect(result).not.toBe(10);
// })

// test("ディーラーがヒットしない場合", () => {
//   let house = table.getHouse();
//   house.setHand(new Card("spade", "10"));
//   house.setHand(new Card("spade", "10"));
//   table.dealerPhase();
//   const result = house.calcScore();
//   expect(result).toBe(20);
// })