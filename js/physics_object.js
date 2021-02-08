class PhysicsObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,texture, name) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(.2);
    this.body.setDrag(200, 0);

    this.objectName = name;
    this.type = "physics-object"
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.objectName;
  }
}