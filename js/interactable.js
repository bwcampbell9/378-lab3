class Interactable extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,texture, name, onInteract, immovable=true) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.body.immovable = immovable;

    this.objectName = name;
    this.onInteract = onInteract;
    this.type = "interactable";
  }

  getName() {
    return this.objectName;
  }

  getType() {
    return this.type;
  }

  interact(player) {
    this.onInteract(player);
  }
}

class InteractablePhysics extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,texture, name, onInteract, immovable=false) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(.2);
    this.body.setDrag(200, 0);
    this.body.immovable = immovable;

    this.objectName = name;
    this.onInteract = onInteract;
    this.type = "interactable,physics-object";
  }

  getName() {
    return this.objectName;
  }

  getType() {
    return this.type;
  }

  interact(player) {
    this.onInteract(player);
  }
}