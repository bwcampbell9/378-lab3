import Player from "./player_controller.js"
import PhysicsObject from "./physics_object.js"

export default class TileMapLevel extends Phaser.Scene {
  constructor(tilesetPath="../Resources/Subway_tiles_big.png", 
              tilesetName="Spaceship_Tileset_big",
              tilemapPath="../Resources/Spaceship_big_test.json",
              sceneName="Test Scene")
  {
    super(sceneName);
    this.tilesetPath = tilesetPath;
    this.tilesetName = tilesetName;
    this.tilemapPath = tilemapPath;
    this.sceneName = sceneName;
  }

  preload() {
    this.load.image('box', "../Assets/box.png");

    this.load.image('tile_image', this.tilesetPath);
    this.load.tilemapTiledJSON('tilemap', this.tilemapPath);  

    this.load.spritesheet("player_walk", "../Assets/astronautWALK.png", { frameWidth: 32, frameHeight: 36 });
    this.load.spritesheet("player_idle", "../Assets/astronautIDLE.png", { frameWidth: 32, frameHeight: 36 });
    this.load.spritesheet("player_float", "../Assets/astronautFLOAT.png", { frameWidth: 32, frameHeight: 36 });
  }

  create() {

    //const bodyOptions = { restitution: 1, friction: 0, shape: "circle" };
    //const emoji1 = this.matter.add.sprite(250, 100, "box", "1f62c", bodyOptions);
    //const emoji2 = this.matter.add.sprite(250, 275, "box", "1f62c", bodyOptions);

    //Arcade code:

    const map = this.make.tilemap({ key: 'tilemap'});
    const tileset = map.addTilesetImage(this.tilesetName, 'tile_image');

    this.background = map.createDynamicLayer('Background', tileset);
    this.foreground = map.createDynamicLayer('Foreground', tileset);
    this.background.setDepth(-1);
    this.foreground.setDepth(0);
    this.objectLayer = map.getObjectLayer('ObjectLayer')['objects'];

    this.background.setCollisionByProperty({collides: true});
    this.foreground.setCollisionByProperty({collides: true});
    // //this.decorations.setCollisionByProperty({collides: true});

    this.matter.world.convertTilemapLayer(this.background);
    this.matter.world.convertTilemapLayer(this.foreground);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const boxOptions = {
      restitution: 0,
      friction: 1,
      frictionStatic: 1,
    }

    this.player = null;

    const tilesetProps = map.tilesets[0].tileProperties;

    this.physicsObjects = [];

    this.objectLayer.forEach(object => {
      const props = tilesetProps[object.gid-1];
      switch (props["type"]) {
        case "player":
          this.player = new Player(this, object.x, object.y);
          break;
        case "physics":
          let box = new PhysicsObject(this, object.x, object.y, props["texture"], props["name"], boxOptions);
          this.physicsObjects.push(box);
          this.matter.world.add(box);
          break;
        case "text":
          // let newText = new whatever(this, object.x, object.y props["text"]) // you can add and use other props too
          //this.textObjects.add(newText); //make group called textObjects and add collision with the player then on collision for the first time show the text.
        default:
          break;
      }
    })

    if(!this.player) {
      //error case
      console.error("Error: player object not found in tilemap.");
    } else {
      this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

      this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
        objectA: this.player.sprite,
        callback: this.onPlayerCollide,
        context: this
      });
    }

    //this.matter.world.createDebugGraphic();

    // this.physics.world.bounds.width = this.background.width;
    // this.physics.world.bounds.height = this.background.height;

    // this.physics.world.addCollider(this.player, this.foreGround);
    // this.physics.world.addCollider(this.physicsObjects, this.foreGround);
    // this.physics.world.addCollider(this.player, this.decorations);
    // this.physics.add.collider(this.physicsObjects, this.physicsObjects);
    // this.physics.add.collider(this.player, this.physicsObjects);
  }

  update(time, delta)
  {

    //  Arcade Code:
    this.player.updateInteract(this.physicsObjects);
  }
}