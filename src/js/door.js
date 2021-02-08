import Phaser from "../lib/phaser.js"

export default class Door {
    constructor(player, scene, x, y, fromScene, toScene, map) {
        this.scene = scene;
        console.log("door loaded");
        this.connectScene = toScene;
        this.player = player
        const pos = map.tileToWorldXY(x, y)
        this.sprite = scene.physics.add.staticSprite(pos.x, pos.y, "door");

        this.scene.physics.add.overlap(this.player.sprite,
            this.sprite, this.triggerDoor, null, this);
        this.sprite.setScale(2.5);
        this.key = scene.input.keyboard.addKey('S');
        this.fromScene = fromScene;
    }

    update()
    {
        
    }

    triggerDoor()
    {
        console.log("made it here at least");
        if(this.player.onGround)
        {
            if(this.key.isDown)
            {
                console.log("left down!");
                this.scene.game.scene.switch(this.fromScene,
                    this.connectScene);
            }
        }
    }
}