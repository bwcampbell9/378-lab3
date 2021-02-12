import TileMapLevel from "./tileMapLoader.js"
import Phaser from "../lib/phaser.js"

const DEFAULT_WIDTH = 1024
const DEFAULT_HEIGHT = 576
const MAX_WIDTH = 1536
const MAX_HEIGHT = 864
let SCALE_MODE = 'SMOOTH' // FIT OR SMOOTH

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 200,
    parent: "game-container",
    backgroundColor: "#1d212d",
    scene: TileMapLevel,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 }
      }
    },
    render: {
      antialias: false,
    },
    scale: {
      // we do scale the game manually in resize()
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
  };

const game = new Phaser.Game(config);

  