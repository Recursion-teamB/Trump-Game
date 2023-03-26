import { Card, Deck } from './general';
import {BlackJackPlayer, BlackJackTable} from './blackjack';


let player : BlackJackPlayer = new BlackJackPlayer("jack", "player");
let table : BlackJackTable = new BlackJackTable(player);
let deck : Deck = new Deck();

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

test('カードの合計を計算する(Aceが1の場合)', () => {
  const card1 = new Card("♠︎", "A");
  const card2 = new Card("♦︎", "7");
  const card3 = new Card("♣︎", "J");
  player.setHand([card1, card2, card3]);
  const result = player.calcScore();
  expect(result).toBe(18);
})

test('カードの合計を計算する（Aceが11の場合）', () => {
  const card1 = new Card("♠︎", "A");
  const card2 = new Card("♦︎", "K");
  player.setHand([card1, card2]);
  const result = player.calcScore();
  expect(result).toBe(21);
})

test("合計値が22以上の場合バストする", () => {
  const card1 = new Card("♠︎", "K");
  const card2 = new Card("♦︎", "A");
  const card3 = new Card("♣︎", "Q");
  const card4 = new Card("♣︎", "A");
  player.setHand([card1, card2, card3, card4]);
  const result = player.isBust();
  expect(result).toBe(true);
})

test("合計値が21以下の時バストしない", () => {
  const card1 = new Card("♠︎", "A");
  const card2 = new Card("♦︎", "K");
  player.setHand([card1, card2]);
  const result = player.isBust();
  expect(result).toBe(false);
})


test("カードを引くとデッキから1枚減る", () => {
  const initialDeckSize = deck.getDeck().length;
  deck.draw();
  expect(deck.getDeck().length).toBe(initialDeckSize - 1);
});

test("シャッフル後のデッキはランダムな順序である", () => {
  const initialDeckOrder = deck.getDeck().map(card =>  card.getSuit() + card.getNumber()).join(',');
  deck.shuffle();
  const shuffledDeckOrder = deck.getDeck().map(card =>  card.getSuit() + card.getNumber()).join(',');
  expect(shuffledDeckOrder).not.toBe(initialDeckOrder);
});

test("画像の割り当て", () => {
  const card = new Card("♠︎", "10");
  expect(card.getImg()).toBe("trump-game/public/card_img/s10.png");
})