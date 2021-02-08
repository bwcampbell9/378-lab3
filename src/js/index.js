import FirstRoom from "./firstRoom.js"
import CenterCabin from "./centerCabin.js"
import Phaser from "../lib/phaser.js"
import Chemicals from "./chemicals.js"
import GravityRoom from "./gravity.js"
import SpacesuitRoom from "./spacesuitRoom.js"

console.log('hello')

const config = {
    type: Phaser.AUTO,
    width: 384,
    height: 300,
    parent: "game-container",
    pixelArt: true,
    backgroundColor: "#1d212d",
    scene: [FirstRoom, CenterCabin, 
            Chemicals, GravityRoom, 
            SpacesuitRoom],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 }
      }
    }
  };

const game = new Phaser.Game(config);

  