import TileMapLevel from "./tileMapLoader.js"
import Phaser from "../lib/phaser.js"

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "game-container",
    pixelArt: true,
    backgroundColor: "#1d212d",
    scene: TileMapLevel,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 }
      }
    }
  };

const game = new Phaser.Game(config);

  