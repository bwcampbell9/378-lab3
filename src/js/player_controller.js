export default class PlayerController extends Phaser.Physics.Arcade.Sprite {

    constructor(scene,x,y,texture="player_float") {
		super(scene,x,y,texture);
		this.setTexture(texture);
		scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;

		this.setBounce(0);
        this.setCollideWorldBounds(true); // don't go out of the map

        this.pushable = false;

        this.scaleX = .5;
        this.scaleY = .5;

        this.body.setSize(this.width, this.height-8);

        this.cursors = scene.input.keyboard.createCursorKeys();

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
            frames: scene.anims.generateFrameNames('player_walk', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNames('player_idle', {start: 0, end: 8}),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'float',
            frames: scene.anims.generateFrameNames('player_float', {start: 0, end: 0}),
            frameRate: 0,
            repeat: -1
        });

        // set bounds so the camera won't go outside the game world
        //awscene.cameras.main.setBounds(0, 0, 1, 1);
        // make the camera follow the player
        this.scene.cameras.main.centerOn(this.x, this.y);
      
        // set background color, so the sky is not black    
        scene.cameras.main.setBackgroundColor('#ccccff');

        this.pickups = {};
        this.playerReach = this.displayWidth * 1.5;
        this.motionSmoothing = .7;
        this.jumpHeight = 3;
        this.moveSpeed = 1;
	}

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const camera = this.scene.cameras.main;
        const newX = this.interp(camera.midPoint.x, this.x, .1);
        const newY = this.interp(camera.midPoint.y, this.y, .1);
        //console.log(camera.getWorldPoint(this.x, this.y));
        camera.setScroll(newX-camera.width/2, newY-camera.height/2);
        //console.log("oldX: " + camera.midPoint.x + "newX: " + newX + ", oldY: " + camera.midPoint.y + "newY: " + newY);
        //camera.centerOn(2000, 2000);
        //console.log(this.x, this.y)
        //camera.centerOn(this.x, this.y);
        
        let anim = 'idle';
        if (this.keys.left.isDown)
        {
            this.setVelocityX(-100 * this.moveSpeed);
            anim = 'walk';
            this.flipX = false; // flip the sprite to the left
        }
        else if (this.keys.right.isDown)
        {
            this.body.setVelocityX(100 * this.moveSpeed);
            anim = 'walk';
            this.flipX = true; // use the original sprite looking to the right
        } else {
            this.body.setVelocityX(0);
        }
        if(!(this.body.onFloor() || this.body.touching.down)) {
            anim = 'float';
        }
        this.anims.play(anim, true);

        // jump 
        if (this.keys.up.isDown && (this.body.onFloor() || this.body.touching.down))
        {
            this.body.setVelocityY(-100 * this.jumpHeight);        
        }

        if(this.heldObject) {
            if(Phaser.Input.Keyboard.JustDown(this.keys.pickup)) {
                console.log("drop");
                this.heldObject.body.allowGravity = true;
                this.heldObject.setVelocityX(this.body.velocity.x);
                this.heldObject.setVelocityY(this.body.velocity.y);
                this.heldObject = null;
            } else {
                const holdDistance = this.displayWidth/2 + this.heldObject.displayWidth/2 + 5;
                const targetX = ((this.x + (holdDistance * (this.flipX ? 1 : -1))) - this.heldObject.x) + this.heldObject.x;
                const targetY = (this.y - this.heldObject.y) + this.heldObject.y;
                this.heldObject.x = this.interp(this.heldObject.x, targetX, this.motionSmoothing);
                this.heldObject.y = this.interp(this.heldObject.y, targetY, this.motionSmoothing);
            }
        }
    }

    interp(current, target, smoothing) {
        const distance = target - current;
        return current + distance * smoothing;
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