import PlayerController from "./player_controller.js"
import PhysicsObject from "./physics_object.js"

export default class TileMapLevel extends Phaser.Scene {
  constructor(tilesetPath="../Resources/Subway_tiles.png", 
              tilesetName="Spaceship",
              tilemapPath="../Resources/spaceShipLarge.json",
              sceneName="Test Scene")
  {
    super(sceneName);
    this.tilesetPath = tilesetPath;
    this.tilesetName = tilesetName;
    this.tilemapPath = tilemapPath;
    this.sceneName = sceneName;
  }

  preload() {
    this.load.image('tile_image', this.tilesetPath);
    this.load.image('box', "../Assets/box.png");
    this.load.tilemapTiledJSON('tilemap', this.tilemapPath);  

    this.load.spritesheet("player_walk", "../Assets/astronautWALK.png", { frameWidth: 32, frameHeight: 38 });
    this.load.spritesheet("player_idle", "../Assets/astronautIDLE.png", { frameWidth: 32, frameHeight: 38 });
    this.load.spritesheet("player_float", "../Assets/astronautFLOAT.png", { frameWidth: 32, frameHeight: 38 });
  }

  create() {
    // this.add.image(0, 0, 'tiles');
    this.physics.world.setBoundsCollision(true, true, true, true);
    const map = this.make.tilemap({ key: 'tilemap'});
    const tileset = map.addTilesetImage(this.tilesetName, 'tile_image');

    this.background = map.createStaticLayer('Background', tileset);
    this.foreGround = map.createDynamicLayer('Foreground', tileset);
    //this.decorations = map.createStaticLayer('decoration', tileset);
    this.playerLayer = map.getObjectLayer('PlayerLayer')['objects'];
    this.boxLayer = map.getObjectLayer('BoxLayer')['objects'];

    //this.background.setScale(2);
    //this.foreGround.setScale(2);

    this.background.setCollisionByProperty({collides: true});
    this.foreGround.setCollisionByProperty({collides: true});
    //this.decorations.setCollisionByProperty({collides: true});

    this.player = null;
    this.physicsObjects = this.add.group();

    console.log(this.boxLayer);
    this.playerLayer.forEach(object => {
        this.player = new PlayerController(this, object.x, object.y, "player_float");
      })

    this.boxLayer.forEach(object => {
      console.log("new box");
        let newBox = new PhysicsObject(this, object.x, object.y, "box", "box");
        this.physicsObjects.add(newBox);
      })

    // console.log(this.objectLayer);
    // this.objectLayer.forEach(object => {
    //   console.log(object);
    //   switch (object.type) {
    //     case "player":
    //       this.player = new PlayerController(this, object.x, object.y, texture);
    //       break;
    //     case "physics":
    //       let newBox = new PhysicsObject(this, object.x, object.y, object.texture, object.name);
    //       this.physicsObjects.add(newBox);
    //     default:
    //       break;
    //   }
    // })

    if(!this.player) {
      //error case
      console.error("Error: player object not found in tilemap.");
    }

    this.physics.world.bounds.width = this.background.width;
    this.physics.world.bounds.height = this.background.height;

    this.physics.world.addCollider(this.player, this.foreGround);
    this.physics.world.addCollider(this.physicsObjects, this.foreGround);
    this.physics.world.addCollider(this.player, this.decorations);
    this.physics.add.collider(this.physicsObjects, this.physicsObjects);
    this.physics.add.collider(this.player, this.physicsObjects);
  }

  update(time, delta)
  {
    this.physicsObjects.children.entries.forEach(phys => {
      this.player.updateInteract(phys);
    });
  }
}