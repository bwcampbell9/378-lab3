export default class PhysicsObject extends Phaser.Physics.Matter.Sprite {
  constructor(scene,x,y,texture, name, options) {
		super(scene.matter.world,x,y,texture, options=options);
    scene.add.existing(this);
		//scene.add.existing(this);
    //scene.physics.add.existing(this);
    //this.setCollideWorldBounds(true);
    //this.setBounce(0);
    //this.setPushable(false);
    //this.body.setDrag(100, 0);
    //this.body.setMass(1);

    this.objectName = name;
    this.type = "physics-object"
    this.setCollisionCategory(2);
    this.setMass(1);
    console.log(this.body);
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.objectName;
  }
}