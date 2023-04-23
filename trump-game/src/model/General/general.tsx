export class Card{
    private suit : string;
    private number : string;
    private img : string;
    private phaserImage: Phaser.GameObjects.Image | null;
    constructor(suit : string, number : string){
        this.suit = suit;
        this.number = number;
        this.img = `${suit}${Deck.getValueList().indexOf(this.number) + 1}`;
        this.phaserImage = null;
    }

    public getSuit() : string{
        return this.suit;
    }
    public getNumber() : string{
        return this.number;
    }
    //カードのnumberを数字で返す
    public getRank() : number{
        return Deck.getValueList().indexOf(this.number) + 1;
    }
    public getImg() : string{
        return this.img;
    }
    public getPhaserImage() : Phaser.GameObjects.Image{
        if(this.phaserImage === null){
            throw new Error("PhaserImage is null");
        }
        return this.phaserImage;
    }
    public createPhaserImg(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Image {
        this.phaserImage = scene.add.image(x, y, this.img);
        return this.phaserImage;
    }
}

export class Deck{
    private deck : Card[] = [];
    private static valueList : string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    private static suitList : string[] = ["s", "d", "h", "c"];

    constructor(mode : string){
        if(mode === "default"){
            this.deck = this.createDeck();
        }
        else if(mode === "black"){
            this.deck = this.createBlackDeck();
        }
        else if(mode === "red"){
            this.deck = this.createRedDeck();
        }
        this.shuffle();
    }

    //52枚のカードをデッキに入れるメソッド
    public createDeck() : Card[]{
        let tempDeck : Card[] = [];
        for(let suit of Deck.suitList){
            for(let value of Deck.valueList){
                tempDeck.push(new Card(suit, value));
            }
        }
        return tempDeck;
    }

    // クラブとスペードのみの黒いカードのデッキを作る
    public createBlackDeck() : Card[]{
        let tempDeck : Card[] = [];
        for(let suit of Deck.suitList){
            if(suit === "s" || suit === "c"){
                for(let value of Deck.valueList){
                    tempDeck.push(new Card(suit, value));
                }
            }
        }
        return tempDeck;
    }

    // ハートとダイヤのみの赤いカードのデッキを作る
    public createRedDeck() : Card[]{
        let tempDeck : Card[] = [];
        for(let suit of Deck.suitList){
            if(suit === "h" || suit === "d"){
                for(let value of Deck.valueList){
                    tempDeck.push(new Card(suit, value));
                }
            }
        }
        return tempDeck;
    }

    //デッキの一番後ろからカードを1枚引く
    public draw() : Card{
        let drawnCard : Card  = this.deck[this.deck.length - 1];
        this.deck.pop();
        return drawnCard;
    }
    //デッキをランダムな順序に変更
    public shuffle() : void{
        for(let index = this.deck.length - 1; index > 0; index--){
            let randomIndex = Math.floor(Math.random() * (index + 1));
            let temp = this.deck[index];
            this.deck[index] = this.deck[randomIndex];
            this.deck[randomIndex] = temp;
        }
    }
    public static getValueList() : string[]{
        return Deck.valueList;
    }
    public static getSuitList() : string[]{
        return Deck.suitList;
    }
    public getDeck() : Card[]{
        return this.deck;
    }

    public isEmpty() : boolean{
        if(this.deck.length === 0) return true;
        return false;
    }
}

export class Player{
    protected name : string;
    protected type : string;
    protected hand : Card[];
    
    constructor(name : string, type : string){
        this.name = name;
        this.type = type;
        this.hand = [];
    }

    public getName() : string{
        return this.name;
    }
    public getHand() : Card[]{
        return this.hand;
    }
    public addHand(card : Card) : void{
        this.hand.push(card);
    }
    public getType() : string{
        return this.type;
    }
    public resetHand() : void {
        this.hand = [];
    }
    public isEmptyHand(){
        if(this.hand.length === 0){
            return true;
        }
        return false;
    }
    //テストのみで使用すること
    public setHand(cardsForTest : Card[]) : void{
        this.hand = cardsForTest;
    }
}

export class CardManager<T extends Phaser.Scene> {
    protected scene: T;
    protected deck: Deck;
    protected cards: Phaser.GameObjects.Image[];
    protected cardWidth: number;
    protected cardHeight: number;
    
  
    constructor(scene: T,deck : Deck, width: number, height: number){
      this.scene = scene
      this.deck = deck
      this.cards = [];
      this.cardWidth = width * 0.05
      this.cardHeight = this.cardWidth * 1.6
    }
  
    public getCardWidth() : number{
        return this.cardWidth
    }

    public getCardHeight() : number{
        return this.cardHeight
    }

    public getCardImageArr() : Phaser.GameObjects.Image[]{
        return this.cards
    }

    public setCardImageArr(num : number, cardImage : Phaser.GameObjects.Image) : void{
        this.cards[num] = cardImage
    }

    public dealCard(card: Card, startX: number, startY: number, goalX: number,goalY: number, flipOver : boolean, duration: number = 200): Phaser.GameObjects.Image | null {
      if (this.deck.getDeck().length <= 0) {
        return null
      }
    
      // カードをデッキの位置に裏向きで作成します
      const cardImage = this.scene.add.image(startX, startY, 'card-back');
      cardImage.setOrigin(0.5, 0.5);
      cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
      console.log(this.cardWidth, this.cardHeight)
      cardImage.setData(card.getSuit() + card.getRank(), card);
      this.cards.push(cardImage);
  
      // カードをプレイヤーの場所までアニメーションさせます
      this.scene.tweens.add({targets: cardImage, x: goalX, y: goalY, duration: duration, ease: 'Linear',});
  
      //表の画像に差し替えます. ひっくり返るようなアニメーションは追加してません.
      //flipOverがtrueのときのみ裏返す.
      if(flipOver){
        setTimeout(() => {
          this.flipOverCard(card, cardImage)
        }, duration + 50 );
      }
      
      return cardImage;
    }
  
    public flipOverCard(card: Card, cardImage: Phaser.GameObjects.Image): Phaser.GameObjects.Image{
      const cardTexture = `${card.getSuit()}${card.getRank()}`;
      cardImage.setTexture(cardTexture);
      cardImage.setDisplaySize(this.cardWidth, this.cardHeight);
      return cardImage
    }
    public dealCardToPlayer(player: Player,card: Card, startX: number, startY : number,goalX : number, goalY : number, flipCard: boolean, duration: number = 200 ): void {
      const cardImage = this.dealCard(card, startX, startY ,goalX, goalY, flipCard);
      if (cardImage) {
        const cardData: Card = cardImage.getData(card.getSuit() + card.getRank());
        player.addHand(cardData);
      }
    }
    public clearCards(): void {
      for (const cardImage of this.cards) {
        cardImage.destroy();
      }
      this.cards = [];
    }
  }
  

export class Position {
    public x : number;
    public y : number;
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
}