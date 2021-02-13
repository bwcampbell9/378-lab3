import Phaser from "../lib/phaser.js"

export default class Door {
    constructor(player, scene, x, y, fromScene, toScene, map) {
        this.scene = scene;
        this.connectScene = toScene;
        this.player = player
        const pos = map.tileToWorldXY(x, y)
        this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, pos.x, pos.y, "door", 0, {
            isStatic: true,
        });
        scene.add.existing(this.sprite);

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
        if(this.player.onGround)
        {
            this.scene.game.scene.switch(this.fromScene,
                this.connectScene);
        }
    }
}