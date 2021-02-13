import MultiKey from "./multi-key.js";

// const camera = this.scene.cameras.main;
// const newX = this.interp(camera.midPoint.x, this.x, .1);
// const newY = this.interp(camera.midPoint.y, this.y, .1);

export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "player_float");
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
      const mainBody = Bodies.rectangle(0, h*.25, w * 0.5, h * .9, { chamfer: { radius: 2 } });
      this.sensors = {
        bottom: Bodies.rectangle(0, h * 0.7, w * 0.4, 2, { isSensor: true }),
        left: Bodies.rectangle(-w * 0.3, h*.25, 2, h * 0.8, { isSensor: true }),
        right: Bodies.rectangle(w * 0.3, h*.25, 2, h * 0.8, { isSensor: true })
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
        .setPosition(x, y)
        .setCollisionCategory(1);

        const { LEFT, RIGHT, SPACE, SHIFT, UP, A, D, W, E, F } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(scene, [LEFT, A]);
        this.rightInput = new MultiKey(scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(scene, [UP, W, SPACE]);
        this.pickup = new MultiKey(scene, [E]);
        this.interact = new MultiKey(scene, [F]);
        this.walk = new MultiKey(scene, [SHIFT]);

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
    
        this.sprite.setMass(.05);

        this.closeObj = null;

        this.acceleration = .0004;
        this.maxRunVelocity = 3;
        this.maxWalkVelocity = .5;
        this.maxVelocity = this.maxRunVelocity;
        this.jumpHeight = 5.5;
        this.playerReach = 75;
        this.motionSmoothing = .37;
    }

    update() {
        if (this.destroyed) return;

        const sprite = this.sprite;
        const velocity = sprite.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isWalkKeyDown = this.walk.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;

        if(isWalkKeyDown) {
            this.maxVelocity = this.maxWalkVelocity;
        } else {
            this.maxVelocity = this.maxRunVelocity;
        }

        let anim = "idle";
        if (isLeftKeyDown) {
            if(!isWalkKeyDown) sprite.setFlipX(false);
            if (!(isInAir && this.isTouching.left)) {
                sprite.applyForce({ x: -this.acceleration, y: 0 });
            }
            anim = "walk";
        } else if (isRightKeyDown) {
            if(!isWalkKeyDown) sprite.setFlipX(true);
            if (!(isInAir && this.isTouching.right)) {
                sprite.applyForce({ x: this.acceleration, y: 0 });
            }
            anim = "walk";
        }

        if(isInAir) {
            anim = 'float';
        }

        this.sprite.anims.play(anim, true);

        // Limit horizontal speed, without this the player's velocity would just keep increasing to
        // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
        // interfere with gravity.
        if (velocity.x > this.maxVelocity) sprite.setVelocityX(this.maxVelocity);
        else if (velocity.x < -this.maxVelocity) sprite.setVelocityX(-this.maxVelocity);

        if (isJumpKeyDown  && isOnGround) {
            sprite.setVelocityY(-this.jumpHeight);
        }

        if(this.heldObject) {
            if(this.pickup.justDown()) {
                this.heldObject.setCollidesWith(3);
                this.heldObject.setIgnoreGravity(false);
                this.heldObject.setVelocity(velocity.x, velocity.y);
                this.heldObject = null;
            } else {
                const holdDistance = this.sprite.displayWidth/2 + this.heldObject.displayWidth/2;
                const targetX = ((this.sprite.x + (holdDistance * (this.sprite.flipX ? 1 : -1))) - this.heldObject.x) + this.heldObject.x;
                const targetY = (this.sprite.y - this.heldObject.y) + this.heldObject.y;
                this.heldObject.setPosition(this.interp(this.heldObject.x, targetX, this.motionSmoothing),
                                            this.interp(this.heldObject.y, targetY, this.motionSmoothing));
                this.heldObject.setRotation(this.interp(this.heldObject.rotation, velocity.x/this.maxVelocity * 0.7853, .1));
            }
        }
    }

    updateInteract(physObjs) {
        var smallestDistance = 5000;
        var closeObj = null;
        const phys = physObjs[0];
        //console.log(this.sprite.x, this.sprite.y);a
        //console.log("Dist: " + this.distance(this.sprite.x, this.sprite.y, phys.x, phys.y));
        if(!this.heldObject) {
            physObjs.forEach(phys => {
                const dist = this.distance(this.sprite.x, this.sprite.y, phys.x, phys.y);
                //console.log(this.sprite.x, this.sprite.y);
                //console.log("Dist: " + (this.sprite.x, this.sprite.y, phys.x, phys.y));
                if(dist < smallestDistance && dist < this.playerReach) {
                    smallestDistance = dist;
                    closeObj = phys;
                }
            });
            if(closeObj) {
                if(closeObj != this.closeObj) {
                    if(this.closeObj) this.closeObj.removeOutline();
                    closeObj.addOutline();
                    this.closeObj = closeObj;
                }
                if(closeObj.getType && closeObj.getType().includes("physics-object")) {
                    // pop up little E icon to show that you can interact
                    if(this.pickup.justDown()) {
                        this.heldObject = closeObj;
                        this.heldObject.setCollidesWith(0);
                        this.heldObject.setIgnoreGravity(true);
                    }
                }
                // if(phys.getType && closeObj.getType().includes("interactable")) {
                //     //pop up little F icon
                //     if(Phaser.Input.Keyboard.JustDown(this.interact)) {
                //         closeObj.interact(this);
                //     }
                // }
            }
        } else if(this.closeObj) {
            this.closeObj.removeOutline();
            this.closeObj = null
        }
        if(this.closeObj && this.distance(this.sprite.x, this.sprite.y, this.closeObj.x, this.closeObj.y) > this.playerReach) {
            this.closeObj.removeOutline();
            this.closeObj = null
        }
    }

    interp(current, target, smoothing) {
        const distance = target - current;
        return current + distance * smoothing;
    }

    distance(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.sqrt( a*a + b*b );
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
  