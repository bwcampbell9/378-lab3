import Player from "./player_controller.js";
import PhysicsObject from "./physics_object.js";
import OutlinePipeline from "./outline.js";
import Door from "./door.js";

export default class TileMapLevel extends Phaser.Scene {
  constructor(tilesetPath="Resources/Subway_tiles_big.png", 
              tilesetName="Spaceship_Tileset_big",
              tilemapPath="Resources/Spaceship_big_test.json",
              sceneName="Main Scene")
  {
    super(sceneName);
    this.tilesetPath = tilesetPath;
    this.tilesetName = tilesetName;
    this.tilemapPath = tilemapPath;
    this.sceneName = sceneName;
  }

  preload() {
    this.load.image('box', "Assets/box.png");

    this.load.image('tile_image', this.tilesetPath);
    this.load.tilemapTiledJSON('tilemap', this.tilemapPath);  

    this.load.spritesheet("player_walk", "Assets/astronautWALK.png", { frameWidth: 32, frameHeight: 36 });
    this.load.spritesheet("player_idle", "Assets/astronautIDLE.png", { frameWidth: 32, frameHeight: 36 });
    this.load.spritesheet("player_float", "Assets/astronautFLOAT.png", { frameWidth: 32, frameHeight: 36 });

    this.outlinePipeline = this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
    
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
    this.decoration = map.createDynamicLayer('Decoration', tileset);
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
        default:
          break;
      }
    });

        //this.cameras.main.setRenderToTexture(this.outlinePipeline);

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

    const rect = map.findObject("Sensors", obj => obj.name === "Door");
    const doorSensor = this.matter.add.rectangle(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      rect.width,
      rect.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );
    this.unsubscribeDoor = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: doorSensor,
      callback: this.onPlayerWin,
      context: this
    });


    //this.matter.world.createDebugGraphic();

    // this.physics.world.bounds.width = this.background.width;
    // this.physics.world.bounds.height = this.background.height;

    // this.physics.world.addCollider(this.player, this.foreGround);
    // this.physics.world.addCollider(this.physicsObjects, this.foreGround);
    // this.physics.world.addCollider(this.player, this.decorations);
    // this.physics.add.collider(this.physicsObjects, this.physicsObjects);
    // this.physics.add.collider(this.player, this.physicsObjects);
  }

  onPlayerWin() {
    // Celebrate only once
    this.unsubscribeDoor();

    console.log("switching");
    this.game.scene.switch("Main Scene",
      "End Scene");
  }

  update(time, delta)
  {

    //  Arcade Code:
    this.player.updateInteract(this.physicsObjects);
  }
}



var CustomPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
  initialize:
  function CustomPipeline (game)
  {
  Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
          game: game,
          renderer: game.renderer,
          fragShader: [
              'precision lowp float;',
              'varying vec2 outTexCoord;',
              'varying vec4 outTint;',
              'uniform sampler2D uMainSampler;',
              'uniform float alpha;',
              'uniform float time;',
              'void main() {',
                  'vec4 sum = vec4(0);',
                  'vec2 texcoord = outTexCoord;',
                  'for(int xx = -4; xx <= 4; xx++) {',
                      'for(int yy = -4; yy <= 4; yy++) {',
                          'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                          'float factor = 0.0;',
                          'if (dist == 0.0) {',
                              'factor = 2.0;',
                          '} else {',
                              'factor = 2.0/abs(float(dist));',
                          '}',
                          'sum += texture2D(uMainSampler, texcoord + vec2(xx, yy) * 0.002) * (abs(sin(time))+0.06);',
                      '}',
                  '}',
                  'gl_FragColor = sum * 0.025 + texture2D(uMainSampler, texcoord)*alpha;',
              '}'
          ].join('\n')
      });
  } 
});