class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,texture, name) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.allowGravity = false;

    this.pickupName = name;
    this.type = "pickup";
  }

  collidePlayer(player) {
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.pickupName;
  }
}