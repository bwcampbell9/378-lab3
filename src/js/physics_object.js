export default class PhysicsObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,texture, name) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setPushable(false);
    //this.body.setDrag(100, 0);

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