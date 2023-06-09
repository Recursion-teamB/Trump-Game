import Phaser from 'phaser';
import LobbyScene from './scene/Lobby';
import BlackGameScene from './scene/BlackJack/BlackGame';
import { WarScene } from './scene/War/warGame';
import BlackLevelScene  from './scene/BlackJack/BlackLevel';
import { SpeedGameScene } from './scene/Speed/SpeedGame';
import preloadScene from './scene/preload';
import WarLevelScene from './scene/War/warLevel';
import SpeedLevelScene from './scene/Speed/SpeedLevel';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'phaser-game'
    },
    scene: [preloadScene, LobbyScene, WarScene, SpeedGameScene, BlackLevelScene, BlackGameScene, WarLevelScene, SpeedLevelScene],
}

const phaserGame = new Phaser.Game(config);

export default phaserGame;