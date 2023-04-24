export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({key: 'LobbyScene'})
    }

    preload(){}

    create()
    {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'lobby-background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        let buttonWidth = 150;
        let buttonHeight = 150;
        let x = (this.cameras.main.width - (buttonWidth * 7)) / 2 + buttonWidth / 2;
        let y = (this.cameras.main.height - buttonHeight) / 2 + buttonHeight/ 2;
        for(let i = 0;  i < 3; ++i){
            this.createButton(x, y, i);
            
            x += buttonWidth*3;

            // ボタンが4つ以上なら2段にするために使用する。
            // if ((i + 1) % 3 === 0) {
            //     x = (this.cameras.main.width - (buttonWidth * 3)) / 2 + buttonWidth / 2;
            //     y += buttonHeight;
            // }
        }
    }

    createButton(x : number, y : number, index : number){
        let imageName = index === 0? "war": index === 1?  "blackjack": "speed";
        let buttonText = index === 0? "War": index === 1?  "Black Jack": "Speed";

        let button = this.add.image(x, y, imageName).setInteractive();
        let text = this.add.text(x, y, buttonText, {font: "50px Arial",
    }).setOrigin(0.5);
        text.setStroke('000000', 5);
        // let game = i === 0? 'war': i === 1? 'blackjack': 'speed';
        // let text = this.add.bitmapText(400, 300, 'font', 'Button Text', 32).setOrigin(0.5);
        // let button = this.add.image(x, y, game).setInteractive();
        let maxScale = 150;

        if(Math.max(button.width, button.height) > maxScale){
            let scale = maxScale / Math.max(button.width, button.height)
            button.setScale(scale);
        }
        switch (index) {
            case 0:
                button.on('pointerdown', () => {
                    this.newSceneStart('WarScene');
                })
                break;
            case 1:
                button.on('pointerdown', () => {
                    this.newSceneStart('BlackLevelScene');
                })
                break;
            case 2:
                button.on('pointerdown', () => {
                    this.newSceneStart('SpeedGameScene');
                })
                break;
        }
        this.buttonBehavior(button, text);
    }

    buttonBehavior(button : Phaser.GameObjects.Image, text : Phaser.GameObjects.Text) : void{
        let scale = button.scale
        button.on('pointerover', () => {
            button.setScale(scale*1.2);
            text.setScale(1.2);
        });
        button.on('pointerout', () => {
            button.setScale(scale);
            text.setScale(1);
        });
    }

    newSceneStart(name : string) : void {
        this.scene.start(name);
        this.scene.stop('LobbyScene');
    }

    update(){}
}