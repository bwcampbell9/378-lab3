import PlayerController from "./player_controller.js"
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
    this.load.image('tile_image', this.tilesetPath);
    this.load.image('box', "../Assets/box.png");
    this.load.tilemapTiledJSON('tilemap', this.tilemapPath);  

    this.load.spritesheet("player_walk", "../Assets/astronautWALK_big.png", { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("player_idle", "../Assets/astronautIDLE_big.png", { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("player_float", "../Assets/astronautFLOAT_big.png", { frameWidth: 64, frameHeight: 72 });
  }

  create() {
    // this.add.image(0, 0, 'tiles');
    this.physics.world.setBoundsCollision(true, true, true, true);
    const map = this.make.tilemap({ key: 'tilemap'});
    const tileset = map.addTilesetImage(this.tilesetName, 'tile_image');

    this.background = map.createLayer('Background', tileset);
    this.foreGround = map.createLayer('Foreground', tileset);
    this.objectLayer = map.getObjectLayer('ObjectLayer')['objects'];

    //this.background.setScale(2);
    //this.foreGround.setScale(2);

    this.background.setCollisionByProperty({collides: true});
    this.foreGround.setCollisionByProperty({collides: true});
    //this.decorations.setCollisionByProperty({collides: true});

    this.player = null;
    this.physicsObjects = this.add.group();

    const tilesetProps = map.tilesets[0].tileProperties;


    this.objectLayer.forEach(object => {
      const props = tilesetProps[object.gid-1];
      switch (props["type"]) {
        case "player":
          this.player = new PlayerController(this, object.x, object.y);
          break;
        case "physics":
          let newBox = new PhysicsObject(this, object.x, object.y, props["texture"], props["name"]);
          this.physicsObjects.add(newBox);
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