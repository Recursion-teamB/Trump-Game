export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({key: 'LobbyScene'})
    }

    preload()
    {
        this.load.image('background', 'assets/lobbyImg/playing-cards-background.jpg')
        this.load.image('blackjack', 'assets/lobbyImg/blackjack-icon.jpg');
    }

    create()
    {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        let buttonWidth = 150;
        let buttonHeight = 150;
        let x = (this.cameras.main.width - (buttonWidth * 3)) / 2 + buttonWidth / 2;
        let y = (this.cameras.main.height - (buttonHeight * 2)) / 2 + buttonHeight/ 2;
        for(let i = 0;  i < 6; ++i){
            let button = this.add.sprite(x, y, 'blackjack').setInteractive().setScale(0.4);
            button.on('pointerover', () => {
                button.setScale(0.4*1.2);
            });

            button.on('pointerout', () => {
                button.setScale(0.4);
            });

            button.on('pointerdown', () => {
                this.scene.start('BlackLevelScene');
                this.scene.stop('LobbyScene');
                this.textures.remove('background');
            })

            x += 150;
            if ((i + 1) % 3 === 0) {
                x = (this.cameras.main.width - (buttonWidth * 3)) / 2 + buttonWidth / 2;
                y += buttonHeight;
            }
        }
    }

    update(){}
}