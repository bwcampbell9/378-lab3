var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: {y: 500},
          debug: false
      }
  },
  scene: {
      key: 'main',
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;

function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON('map', 'assets/map.json');
  // tiles in spritesheet 
  this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
  // simple coin image
  this.load.image('coin', 'assets/coinGold.png');
  this.load.image('box', 'assets/box.png');
  // player animations
  this.load.atlas('player', 'assets/player.png', 'assets/player.json');
}

function create() {
  // load the map 
  map = this.make.tilemap({key: 'map'});

  // tiles for the ground layer
  var groundTiles = map.addTilesetImage('tiles');
  // create the ground layer
  groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
  // the player will collide with this layer
  groundLayer.setCollisionByExclusion([-1]);

  this.physicsObjects = this.add.group();
  this.player = new PlayerController(this, 200, 200,  "player");
  // Load objects from tilemap and add colliders

  //Testing
  // let coin = new Pickup(this, 400, 400, "coin", "coin");
  // this.physics.add.collider(this.player, coin, function(player, pickup) {
  //   player.collidePickup(pickup);
  //   pickup.collidePlayer(player);
  // });
  
  //this.physicsObjects.add(new PhysicsObject(this, 500, 100, "box", "box"));
  this.physicsObjects.add(new Interactable(this, 500, 100, "box", "box", () => {console.log("interact");}));

  // set the boundaries of our game world
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;

  
  // player will collide with the level tiles 
  this.physics.add.collider(groundLayer, this.physicsObjects);
  this.physics.add.collider(groundLayer, this.player);
  this.physics.add.collider(this.physicsObjects, this.physicsObjects);
  this.physics.add.collider(this.player, this.physicsObjects);

}

function update(time, delta) {
  this.physicsObjects.children.entries.forEach(phys => {
    this.player.updateInteract(phys);
  });
}