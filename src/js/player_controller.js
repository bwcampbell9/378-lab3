import MultiKey from "./multi-key.js";

export class PlayerController extends Phaser.Physics.Matter.Sprite {

    constructor(scene,x,y,texture="player_float", options) {
		super(scene.matter.world,x,y,texture, options=options);
		scene.add.existing(this);

        this.scene = scene;

        //this.body.setSize(this.width, this.height-8);

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
        this.motionSmoothing = .4;
        this.jumpHeight = 3;
        this.moveSpeed = 1;
	}

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const camera = this.scene.cameras.main;
        const newX = this.interp(camera.midPoint.x, this.x, .1);
        const newY = this.interp(camera.midPoint.y, this.y, .1);

        camera.setScroll(newX-camera.width/2, newY-camera.height/2);
        
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

export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "player_float");
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
      console.log(w, h);
      const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 2 } });
      this.sensors = {
        bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
        left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
        right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
      };
      const compoundBody = Body.create({
        parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
        frictionStatic: 0,
        frictionAir: 0.02,
        friction: 0.1
      });
      this.sprite
        .setExistingBody(compoundBody)
        .setScale(2)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);

        const { LEFT, RIGHT, SPACE, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(scene, [LEFT, A]);
        this.rightInput = new MultiKey(scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(scene, [UP, W, SPACE]);

        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        //this.jumpCooldownTimer = null;

        // Before matter's update, reset our record of what surfaces the player is touching.
        this.destroyed = false;
        scene.matter.world.on("beforeupdate", this.resetTouching, this);
        this.scene.events.on("update", this.update, this);
        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);

        // If a sensor just started colliding with something, or it continues to collide with something,
        // call onSensorCollide
        scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
    
        this.acceleration = .01;
        this.maxVelocity = 3;
        this.jumpHeight = 10;
    }

    update() {
        if (this.destroyed) return;

        const sprite = this.sprite;
        const velocity = sprite.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;

        if (isLeftKeyDown) {
            sprite.setFlipX(false);
            if (!(isInAir && this.isTouching.left)) {
                sprite.applyForce({ x: -this.acceleration, y: 0 });
            }
        } else if (isRightKeyDown) {
            sprite.setFlipX(true);
            if (!(isInAir && this.isTouching.right)) {
                sprite.applyForce({ x: this.acceleration, y: 0 });
            }
        }

        // Limit horizontal speed, without this the player's velocity would just keep increasing to
        // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
        // interfere with gravity.
        if (velocity.x > this.maxVelocity) sprite.setVelocityX(this.maxVelocity);
        else if (velocity.x < -this.maxVelocity) sprite.setVelocityX(-this.maxVelocity);

        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-this.jumpHeight);
            this.canJump = false;
            // this.jumpCooldownTimer = this.scene.time.addEvent({
            //     delay: 250,
            //     callback: () => (this.canJump = true)
            // });
        }
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyA === this.sensors.left) {
          this.isTouching.left = true;
          if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
          this.isTouching.right = true;
          if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
          this.isTouching.ground = true;
        }
      }
    
      resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
      }

      destroy() {
        this.destroyed = true;
    
        // Event listeners
        this.scene.events.off("update", this.update, this);
        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);
        if (this.scene.matter.world) {
          this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
        }
    
        // Matter collision plugin
        const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });
    
        // Don't want any timers triggering post-mortem
        if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();
    
        this.sprite.destroy();
      }
  }
  