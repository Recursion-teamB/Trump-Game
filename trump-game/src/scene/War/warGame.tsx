import Phaser from "phaser";
import { WarPlayer, WarTable } from "../../model/War/war";
import { Deck, Card } from "../../model/General/general";
import ReactDOM from 'react-dom';
import { ResultPopup } from "../../components/War/WarPopUp";

export class WarScene extends Phaser.Scene {
    private player: WarPlayer = new WarPlayer("You", "Player");
    private table: WarTable = new WarTable(this.player);
    private playerPositions: { [key: string]: { x: number; y: number } } = {};
    private playerScoreTexts: Phaser.GameObjects.Text[] = [];
    private isProcessing: boolean = false;
    private resultPopupContainer : HTMLElement | null = null;
    constructor(){
        super('WarScene');
    }
    preload() {}
    create(){
        this.playerScoreTexts = []
        this.player = new WarPlayer("You", "Player");
        this.table = new WarTable(this.player);
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x008800);
        this.resultPopupContainer = document.createElement('div');
        document.body.appendChild(this.resultPopupContainer);
        this.table.distributeCards();
        this.createSection('player');
        this.createSection('cpu');
        this.updateScoreArea();
    }
    createPlayerCard(card: Card, x: number, y: number) {
      const cardBackImage = this.add.image(x, y, 'back');
      cardBackImage.setScale(0.2);
      cardBackImage.setInteractive();
      cardBackImage.on('pointerdown', async () => {
        //連続クリックによるイベント発火を防ぐ
        if (this.isProcessing) return ;
        this.isProcessing = true;
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const cpuCardBackImage = this.getCpuCardBackImage();
        // プレイヤーのカードをスライドしてフリップ
        await this.slideCard(cardBackImage, screenWidth / 2 + 100, screenHeight / 2);
        await this.slideCard(cpuCardBackImage!, screenWidth / 2 - 100, screenHeight / 2);
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.flipCard(cardBackImage, card);
        await this.flipCard(cpuCardBackImage!, this.table.getPlayers()[1].getHand()[0]);
        // ここで playRound を呼び出し、勝者を取得
        const playerCardIndex = this.table.getPlayers()[0].getHand().indexOf(card);
        const winner = this.table.playRound(playerCardIndex);
        await new Promise(resolve => setTimeout(resolve, 500));
        const judgement = winner === "draw" ? "draw" : `${winner} win!`;
        await this.createEventDisplay(judgement);
        if(winner !== "draw"){
          this.slideCardToJail([cardBackImage, cpuCardBackImage!], winner);
        }
        else {
          // If it's a draw, make both cards invisible.
          cardBackImage.visible = false;
          cpuCardBackImage!.visible = false;
        }
        // スコアを更新
        this.updateScoreArea();
        // ゲームオーバーチェック
        if (this.table.isGameOver()) {
          // ゲーム終了処理（アラートやシーン遷移など）
          setTimeout(() => {
            this.showResultPopUp(this.table.getGameResult()) 
        }, 2000);
        }
        this.isProcessing = false;
      });
      return cardBackImage;
    }

      
    createCpuCard(x: number, y: number) {
        const cardBackImage = this.add.image(x, y, 'back');
        cardBackImage.setScale(0.2);
        return cardBackImage;
    }
      
    createSection(playerType: 'player' | 'cpu') {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const isPlayer = playerType === 'player';
        const playerIndex = isPlayer ? 0 : 1;
        const player = this.table.getPlayers()[playerIndex];
        const yPosition = isPlayer ? screenHeight * 0.75 : screenHeight * 0.25;
        const scoreYPosition = isPlayer ? screenHeight * 0.9 : screenHeight * 0.05;
        const nameYPosition = isPlayer ? screenHeight * 0.85 : screenHeight * 0.1;
      
        this.playerPositions[playerType] = {
          x: screenWidth / 4,
          y: yPosition,
        };
      
        player.getHand().forEach((card, index) => {
          const x = screenWidth / 4 + 30 * index;
          const cardBackImage = isPlayer
            ? this.createPlayerCard(card, x, yPosition)
            : this.createCpuCard(x, yPosition);
        });
      
        const scoreText = this.add.text(
          screenWidth / 2,
          scoreYPosition,
          `Score: ${player.getScore()}`,
          { fontSize: '20px', color: '#FFFFFF' }
        );
        this.playerScoreTexts.push(scoreText);

        const name = this.add.text(
          screenWidth / 2,
          nameYPosition,
          playerType,
          { fontSize: '20px', color: '#FFFFFF' }
        );


    }
      
    
    flipCard(cardImage: Phaser.GameObjects.Image, card: Card): Promise<void> {
        return new Promise((resolve) => {
          const flipTween = this.tweens.add({
            targets: cardImage,
            scaleX: 0,
            duration: 100,
            onComplete: () => {
              cardImage.setTexture(card.getImg());
              resolve();
            },
        });
      
        this.tweens.add({
            targets: cardImage,
            scaleX: 0.2,
            duration: 200,
            delay: 100,
          });
        });
    }
    
    updateScoreArea() {
        this.playerScoreTexts.forEach((scoreText, index) => {
          scoreText.setText(`Score: ${this.table.getPlayers()[index].getScore()}`);
        });
    }
    // スライドアニメーション関数を追加
    slideCard(cardImage: Phaser.GameObjects.Image, x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
          this.tweens.add({
            targets: cardImage,
            x: x,
            y: y,
            duration: 400,
            onComplete: () => resolve(),
          });
        });
    }
    slideCardToJail(cardImages : Phaser.GameObjects.Image[], winner : string): Promise<void>{
        return new Promise((resolve) => {
            const screenWidth = this.cameras.main.width;
            const screenHeight = this.cameras.main.height;
            this.tweens.add({
                targets: cardImages,
                x: winner === "player" ? screenWidth * 0.1 : screenWidth * 0.9,
                y: winner === "player" ? screenHeight * 0.8 : screenHeight * 0.2,
                duration: 400,
                onComplete: () => resolve(),
            });
          });
    }
    getCpuCardBackImage(): Phaser.GameObjects.Image | null {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
      
        for (const gameObject of this.children.list) {
          if (gameObject instanceof Phaser.GameObjects.Image &&
              gameObject.texture.key === 'back' &&
              gameObject.x >= screenWidth / 4 &&
              gameObject.y === screenHeight * 0.25) {
            return gameObject;
          }
        }
      
        return null;
    }
    async createEventDisplay(str : string) : Promise<void> {
      let rectangle = this.add.graphics();
      rectangle.fillStyle(0x000000, 0.7);
      rectangle.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

      // テキストを作成して中央に配置する
      let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, str, {
        font: "60px Arial",
      });
      text.setOrigin(0.5);
      text.setDepth(1);

      await new Promise(resolve => setTimeout(resolve, 1000));
      rectangle.destroy();
      text.destroy();
    }      
    showResultPopUp(text : string){
      this.scene.pause();
      if (!this.resultPopupContainer) {
        return;
      }
      ReactDOM.render(
        <ResultPopup
          text={text}
          quit={() => {
            console.log("quit")
            this.hideDescription()
            this.scene.stop(this)
            this.scene.start("LobbyScene")    
          }}
          restart={() => {
              this.hideDescription()
              console.log("restart")
              this.scene.restart(this);
          }}
          />,
          this.resultPopupContainer
      );
    }

    hideDescription() : void{
      if (this.resultPopupContainer) {
        ReactDOM.unmountComponentAtNode(this.resultPopupContainer);
      }
      this.scene.resume();
    }
}
