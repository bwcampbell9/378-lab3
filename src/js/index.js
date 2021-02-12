import TileMapLevel from "./tileMapLoader.js"
import TitleScreen from "./TitleScreen.js"
import Phaser from "../lib/phaser.js"
import SceneOne from "./SceneOne.js"
import EndScene from "./endScene.js"

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
    pixelArt: true,
    backgroundColor: "#1d212d",
    scene: [TitleScreen, SceneOne, TileMapLevel, EndScene],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 }
      }
    },
    scale: {
      // we do scale the game manually in resize()
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
  };

const game = new Phaser.Game(config);

  