class PlayerController extends Phaser.Physics.Arcade.Sprite {

    constructor(scene,x,y,texture) {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
        scene.physics.add.existing(this);

		this.setBounce(.2);
        this.setCollideWorldBounds(true); // don't go out of the map

        this.body.setSize(this.width, this.height-8);

        this.cursors = scene.input.keyboard.createCursorKeys();
        console.log(this.cursors);

        const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.scene.input.keyboard.addKeys({
            left: "A",
            right: "D",
            up: "W",
            down: "S",
            interact: "F",
            pickup: "E",
        });

        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        scene.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'p1_stand'}],
            frameRate: 10,
        });

        // set bounds so the camera won't go outside the game world
        scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        scene.cameras.main.startFollow(this);
      
        // set background color, so the sky is not black    
        scene.cameras.main.setBackgroundColor('#ccccff');

        this.pickups = {};
        this.playerReach = 125;
        this.motionSmoothing = 5;
	}

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.keys.left.isDown)
        {
            this.setVelocityX(-200);
            this.anims.play('walk', true); // walk left
            this.flipX = true; // flip the sprite to the left
        }
        else if (this.keys.right.isDown)
        {
            this.body.setVelocityX(200);
            this.anims.play('walk', true);
            this.flipX = false; // use the original sprite looking to the right
        } else {
            this.body.setVelocityX(0);
            this.anims.play('idle', true);
        }
        // jump 
        if (this.keys.up.isDown && (this.body.onFloor() || this.body.touching.down))
        {
            this.body.setVelocityY(-500);        
        }

        if(this.heldObject) {
            if(Phaser.Input.Keyboard.JustDown(this.keys.pickup)) {
                console.log("drop");
                this.heldObject.body.allowGravity = true;
                this.heldObject.setVelocityX(this.body.velocity.x);
                this.heldObject.setVelocityY(this.body.velocity.y);
                this.heldObject = null;
            } else {
                const holdDistance = this.displayWidth/2 + this.heldObject.displayWidth/2 + 10;
                const targetX = ((this.x + (holdDistance * (this.flipX ? -1 : 1))) - this.heldObject.x) + this.heldObject.x;
                const targetY = (this.y - this.heldObject.y) + this.heldObject.y;
                this.heldObject.x = (this.heldObject.x * (this.motionSmoothing - 1) + targetX) / this.motionSmoothing;
                this.heldObject.y = (this.heldObject.y * (this.motionSmoothing - 1) + targetY) / this.motionSmoothing;
            }
        }
    }

    collidePickup(pickup) {
        const name = pickup.getName();
        this.pickups[name] = this.pickups[name] ? this.pickups[name] + 1 : 1;
        pickup.destroy(); //TODO: add to ui or something to show the player that they have the item
    }

    pickupCount(pickupName) {
        return this.pickups[pickupName] ? this.pickups[pickupName] : 0;
    }

    updateInteract(phys) {
        if(Phaser.Math.Distance.Between(this.x, this.y, phys.x, phys.y) < this.playerReach) {
            if(phys.getType && phys.getType().includes("physics-object") && !this.heldObject) {
                // pop up little E icon to show that you can interact
                if(Phaser.Input.Keyboard.JustDown(this.keys.pickup)) {
                    console.log(phys.getType && phys.getType().includes("physics-object"));
                    this.heldObject = phys;
                    this.heldObject.body.allowGravity = false;
                }
            }
            if(phys.getType && phys.getType().includes("interactable")) {
                //pop up little F icon
                if(Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
                    phys.interact(this);
                }
            }
        }
    }
}