import { Deck } from '../model/General/general';

export default class preloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'preloadScene' });
    }

    preload(){
        this.load.image('lobby-background', 'assets/lobbyImg/playing-cards-background.jpg');
        this.load.image('blackjack', 'assets/lobbyImg/blackjack-icon.jpg')
        this.load.image('help', 'assets/help-icon.png');
        this.load.image('back', 'assets/back.jpg');
        this.load.image('card-back', 'assets/back.jpg');
        this.load.image('back_home', 'assets/return-icon.jpg');
        this.load.image('speed', 'assets/lobbyImg/speed-icon.jpg');
        this.load.image('war', 'assets/lobbyImg/war-icon.png');
        const suits = Deck.getSuitList();
        for (let i = 1; i <= 13; i++) {
            suits.forEach(suit => {
                this.load.image(`${suit}${i}`, `assets/card_img/${suit}${i}.png`);
            });
        }
    }

    create(){
        this.scene.start('LobbyScene');
        // this.scene.start('SpeedGameScene')
        this.scene.stop('preloadScene');
    }
}