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

test("hitコマンドのテスト",() => {
  table.betPhase();
  let preHandsLen = player.getHand().length
  if(player.getAction() === "hit"){
    player.hit(table.getDeck())
    expect(player.getHand().length - preHandsLen).toBe(1)
    if(player.isBust()){
      expect(player.getAction()).toBe("bust")
    }else{
      expect(player.getAction()).toBe("hit")
    }
  }
})

test("standコマンドのテスト",() => {
  table.betPhase();
  if(player.getAction() === "hit"){
    player.stand()
    expect(player.getAction()).toBe("stand")
  }
})

test("douleコマンドのテスト",()=>{
  table.betPhase();
  let preHandsLen = player.getHand().length
  if(player.getAction() === "hit"){
    player.double(table.getDeck(), 100);
    expect(player.getHand().length - preHandsLen).toBe(1)
    if(player.isBust()){
      expect(player.getAction()).toBe("bust")
    }else{
      expect(player.getAction()).toBe("double")
    }
    expect(player.getChips()).toBe(39800)
    expect(player.getCost()).toBe(200)
  }
})

test("surrenderコマンドのテスト", () => {
  table.betPhase();
  if(player.getAction()==="hit"){
    expect(player.getAction()).toBe("surrender")
    expect(player.getChips()).toBe(39950)
  }
})
