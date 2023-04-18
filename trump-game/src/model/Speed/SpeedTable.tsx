import { Card, Deck } from '../General/general'
import { SpeedPlayer } from './SpeedPlayer'

export class SpeedTable {
    private fieldCard : Card[] = [];
    private players : SpeedPlayer[] = [new SpeedPlayer("You", "Player"), new SpeedPlayer("CPU", "CPU")];

    // ゲッター
    public getFieldCard() : Card[]{
        return this.fieldCard;
    }
    public getPlayers() : SpeedPlayer[] {
        return this.players;
    }

    // 台札に置けるカードが2人のプレイヤーの場札にあるのか判定。あればtrue,無ければfalse
    public isContinue() : boolean{
        for(let player of this.players){
            if(player.hasOnTopCard(this)){
                return true;
            }
        }
        return false;
    }

    // ゲーム開始時または重ねられるカードがない場合に台札を更新する関数
    public updateFieldCard() : void{
        let cpuDeck : boolean = true;
        let playerDeck : boolean = true;
        for(let i = 0; i < 2; ++i){
            const player : SpeedPlayer = this.players[i];
            // deckがからではないとき、deckから台札へ
            if(!player.getDeck().isEmpty()){
                this.fieldCard[i] = player.getDeck().draw();
            }
            else{
                const hand = player.getHand();
                let popCard = hand.pop();

                if(popCard !== undefined){
                    this.fieldCard[i] = popCard;
                }

                if(i === 0){
                    playerDeck = false;
                }
                else cpuDeck = false;
            }
        }

        // 画面描画
        if(playerDeck){
            // playerのdeckから台札にカードを重ねるアニメーション
        }
        else{
            // playerのhandから台札にカードを重ねるアニメーション
        }

        if(cpuDeck){
            // cpuのdeckから台札にカードを重ねるアニメーション
        }
        else{
            // cpuのhandから台札にカードを重ねるアニメーション
        }
    }

    // cardとfieldが重ねられるか判定。重ねられればtrue出来なければfalse
    public isOnCard(card : Card, field : Card) : boolean{
        let num : number = card.getRank();
        let target : number = field.getRank();

        if(num === 1){
            if(target === 13 || target === 2){
                return true;
            }
        }
        else if(num === 13){
            if(target === 1 || target === 12){
                return true;
            }
        }
        else{
            if(Math.abs(num - target) === 1){
                return true;
            }
        }
        return false;
    }

    // cpuの手札から移動可能カードを見つけて移動アニメーションを起動するまで
    public moveCpuCard() : void{
        let cpu : SpeedPlayer = this.players[1];
        // 移動できるカードがあるか判定無ければreturn.あれば次の処理へ
        if(!cpu.hasOnTopCard(this)){
            return;
        }
        let moveIndex : number[] = cpu.getOnTopCardIndexAndField(this);

        // 移動のアニメーション おそらく起動するのに移動先の台札と移動させる手札の入力が必要なはずなのでmoveIndexを使って入れる
    }

    // moveCardHandToField()
    public moveCardHandToField(fieldIndex : number, cardIndex : number, player : SpeedPlayer) : void{
        // fieldの書き換え
        this.fieldCard[fieldIndex] = player.getHand()[cardIndex];
        const deck : Deck = player.getDeck();

        // handへのdeckからの追加
        if(!deck.isEmpty()){
            player.getHand()[cardIndex] = deck.draw();
        }
        // deckがなければfieldへ行ったカードのある場所にnull cardを入れる
        // 個々の処理は要検討 cardを入れずhandを縮小するのもあり
        else{
            player.getHand()[cardIndex] = new Card('null', 'null');
        }

        // この行動によって勝利条件を満たしたかを判定する。勝利していた場合、そのプレイヤーのtypeによって別の処理をする。
        if(player.isComplete()){
            if(player.getType() === "CPU"){
                // プレイヤーが負けた画面の表示 and gameのstop
            }
            else{
                // プレイヤーが勝った画面表示 and gameのstop
            }
        }
    }

    // cpu手札から台札にカードを移動する関数
    /*
    cpuの手札から台札に移動するカードを見つける関数
    この関数がカードを見つければカードを移動させるviewが起動する
    viewのアニメーションが完了して時点でthis.isOnCardを起動してtrueなら裏の処理としてカードを移動させる

    手札に移動可能カードがあるか判定 -> true -> 移動させるカードを見つける -> 移動アニメーション -> アニメーション終了時にthis.isOnCard()を起動その移動が有効か判定(アニメーションの完了までにプレイヤーが場札を上書きしている可能性があるため) -> true -> 裏の移動処理をする、viewの場札も変更 -> cpu待機状態へ -> この流れの最初に戻る
    */
}