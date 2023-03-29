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
  const result = table.getPlayers()[1].getCost();
  expect(result).toBe(100);
})

test("hitコマンドのテスト",() => {
  table.betPhase();
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
  // table.betPhase();
  // if(player.getAction() === ("" || "hit")){
  //   player.stand()
  //   expect(player.getAction()).toBe("stand")
  // }
  player.setAction("");
  player.stand()
  const result = player.getAction();
  expect(result).toBe("stand");
})

test("standコマンドのテストthis.actionがhitの場合",() => {
  // table.betPhase();
  // if(player.getAction() === ("" || "hit")){
  //   player.stand()
  //   expect(player.getAction()).toBe("stand")
  // }
  player.setAction("hit");
  player.stand()
  const result = player.getAction();
  expect(result).toBe("stand");
})

test("doubleコマンドのテスト",()=>{
  table.betPhase();
  let preHandsLen = player.getHand().length
  let preChips = player.getChips()
  let preCost = player.getCost()
  if(player.getAction() === ""){
    player.double(table.getDeck(), 100);
    expect(player.getHand().length - preHandsLen).toBe(1)
    if(player.isBust()){
      expect(player.getAction()).toBe("bust")
    }else{
      expect(player.getAction()).toBe("stand")
    }
    expect(player.getChips()).toBe(preChips - 100)
    expect(player.getCost()).toBe(preCost + 100)
  }
})

test("surrenderコマンドのテスト", () => {
  table.betPhase();
  if(player.getAction()===""){
    expect(player.getAction()).toBe("surrender")
    expect(player.getChips()).toBe(39950)
  }
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
  player.addHand(new Card("♠︎", "10"));
  player.addHand(new Card("♠︎", "10"));
  const result = player.calcScore();
  expect(result).toBe(20);
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
  expect(card.getImg()).toBe("/card_img/s10.png");
})

test("ディーラーがヒットする場合", () => {
  let house = table.getHouse()
  house.addHand(new Card("♠︎", "4"));
  house.addHand(new Card("♠︎", "6"));
  table.dealerPhase();
  const result = house.calcScore();
  expect(result).not.toBe(10);
})

test("ディーラーがヒットしない場合", () => {
  let house = table.getHouse();
  house.resetHand();
  house.addHand(new Card("♠︎", "10"));
  house.addHand(new Card("♠︎", "10"));
  table.dealerPhase();
  const result = house.calcScore();
  expect(result).toBe(20);
})