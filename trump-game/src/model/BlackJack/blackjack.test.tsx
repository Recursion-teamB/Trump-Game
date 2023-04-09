import { Card, Deck } from '../General/general';
import {BlackJackPlayer, BlackJackTable} from './blackjack';

let player : BlackJackPlayer = new BlackJackPlayer("jack", "player");
let table : BlackJackTable = new BlackJackTable(player);
let deck : Deck = new Deck();

test("betPhase()によってbetsが変更されている", () => {
  table.betPhase(100);
  const result = table.getBets();
	expect(result).not.toBe([0,0,0]);
});

test("プレイヤーに掛け金がセットされる", () =>{
  table.betPhase(100);
  const result = table.getPlayers()[0].getCost();
  expect(result).toBe(100);
})

test("hitコマンドのテスト",() => {
  table.betPhase(100);
  let preHandsLen = player.getHand().length
  if(player.getAction() === ("" || "hit")){
    player.hit(table.getDeck())
    expect(player.getHand().length - preHandsLen).toBe(1)
    if(player.isBust()){
      expect(player.getAction()).toBe("bust")
    }else{
      expect(player.getAction()).toBe("hit")
    }
  }
})



test("standコマンドのテストthis.actionが空の場合",() => {
  player.setAction("");
  player.stand();
  const result = player.getAction();
  expect(result).toBe("stand");
})

test("standコマンドのテストthis.actionがhitの場合",() => {
  player.setAction("hit");
  player.stand();
  const result = player.getAction();
  expect(result).toBe("stand");
})

test("standコマンドのテストthis.actionがhitと空ではない場合",() => {
  player.setAction("surrender");
  player.stand();
  const result = player.getAction();
  expect(result).toBe("surrender");
})

test("doubleコマンドのテスト、this.actionが空の場合のthis.actionの変更", () => {
  player.setAction("");
  player.setCost(1000);
  player.double(deck, 1000);
  const result = player.getAction();
  expect(result).toBe("stand");
})

test("doubleコマンドのテスト、this.actionが空の場合のthis.costの変更", () => {
  player.setAction("");
  player.setCost(1000);
  player.double(deck, 1000);
  const result = player.getCost();
  expect(result).toBe(2000);
})

test("doubleコマンドのテスト、this.actionが空でない場合のthis.actionの変更", () => {
  player.setAction("hit");
  player.setCost(1000);
  player.double(deck, 1000);
  const result = player.getAction();
  expect(result).toBe("hit");
})

test("doubleコマンドのテスト、this.actionが空でない場合のthis.costの変更", () => {
  player.setAction("hit");
  player.setCost(1000);
  player.double(deck, 1000);
  const result = player.getCost();
  expect(result).toBe(1000);
})

test("doubleコマンドのテスト、枚数が1枚増えている", () => {
  player.setChips(100000);
  player.setHand([new Card("s", "A"), new Card("h", "9")]);
  player.setAction("");
  player.setCost(10);
  const before = player.getHand().length;
  player.double(deck, 10);
  const after = player.getHand().length;
  expect(after).toBe(before + 1);
})

test("surrenderコマンドのテスト、this.actionが空の場合のthis.actionの変更", () => {
  player.setAction("");
  player.surrender();
  const result = player.getAction();
  expect(result).toBe("surrender");
})

test("surrenderコマンドのテスト、this.actionが空の場合のthis.chipsの変更", () => {
  player.setCost(1000);
  player.setChips(0);
  player.setAction("");
  player.surrender();
  const result = player.getChips();
  expect(result).toBe(500);
})

test("surrenderコマンドのテスト、this.actionが空でない場合のthis.actionの変更", () => {
  player.setAction("hit");
  player.surrender();
  const result = player.getAction();
  expect(result).toBe("hit");
})

test("surrenderコマンドのテスト、this.actionが空でない場合のthis.chipsの変更", () => {
  player.setCost(1000);
  player.setChips(0);
  player.setAction("hit");
  player.surrender();
  const result = player.getChips();
  expect(result).toBe(0);
})

test('カードの合計を計算する(Aceが1の場合)', () => {
  const card1 = new Card("♠︎", "A");
  const card2 = new Card("♦︎", "7");
  const card3 = new Card("♣︎", "J");
  player.setHand([card1, card2, card3]);
  const result = player.calcScore();
  expect(result).toBe(18);
})

test('カードの合計を計算する(Aceが11の場合)', () => {
  const card1 = new Card("♠︎", "A");
  const card2 = new Card("♦︎", "K");
  player.setHand([card1, card2]);
  const result = player.calcScore();
  expect(result).toBe(21);
})

test('カードの合計を計算する(Aceが手札にない場合)', () => {
  const card1 = new Card("♠︎", "10");
  const card2 = new Card("♠︎", "10");
  player.setHand([card1, card2])
  const result = player.calcScore();
  expect(result).toBe(20);
})

test('addHandのテスト', () => {
  player.resetHand();
  player.addHand(new Card("s", "10"));
  player.addHand(new Card("h", "10"));
  const result = player.calcScore();
  expect(result).toBe(20);
})

test("合計値が22以上の場合バストする", () => {
  const card1 = new Card("h", "K");
  const card2 = new Card("d", "A");
  const card3 = new Card("c", "Q");
  const card4 = new Card("c", "A");
  player.setHand([card1, card2, card3, card4]);
  const result = player.isBust();
  expect(result).toBe(true);
})

test("合計値が21以下の時バストしない", () => {
  const card1 = new Card("d", "A");
  const card2 = new Card("d", "K");
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
  const card = new Card("s", "10");
  expect(card.getImg()).toBe("s10");
})

test("ディーラーがヒットする場合", () => {
  let house = table.getHouse()
  house.addHand(new Card("s", "4"));
  house.addHand(new Card("c", "6"));
  table.dealerPhase();
  const result = house.calcScore();
  expect(result).not.toBe(10);
}, 10000)

test("ディーラーがヒットしない場合", () => {
  let house = table.getHouse();
  house.resetHand();
  house.addHand(new Card("s", "10"));
  house.addHand(new Card("h", "10"));
  table.dealerPhase();
  const result = house.calcScore();
  expect(result).toBe(20);
}, 10000)