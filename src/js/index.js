import TileMapLevel from "./tileMapLoader.js"
import TitleScreen from "./TitleScreen.js"
import PhaserMatterCollisionPlugin from "../lib/phaser-matter-collision-plugin.js";
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
    width: 512,
    height: 288,
    parent: "game-container",
    backgroundColor: "#1d212d",
    scene: [TileMapLevel, EndScene],
    physics: {
      default: "matter",
      matter: {
        gravity: { y: 1 } // This is the default value, so we could omit this
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
    plugins: {
      scene: [
        {
          plugin: PhaserMatterCollisionPlugin, // The plugin class
          key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
          mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
        }
      ]
    },
  };

const game = new Phaser.Game(config);

  