import * as Phaser from 'phaser';

class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
      super(config);
    }
  }
  
  const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Trump Game',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
  
function preload() {}

function create() {}

function update() {}

const game = new Game(gameConfig);

export default game;