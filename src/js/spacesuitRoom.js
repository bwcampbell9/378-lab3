import Phaser from '../lib/phaser.js'
import TempPlayer from "./tempPlayer.js"

export default class SpacesuitRoom extends Phaser.Scene {

    constructor()
    {
        super('Spacesuit Room');
    }

    loadPlayer()
    {
        this.load.spritesheet(
            "player",
            "../Assets/upN1-0x72-industrial-player-32px-extruded.png",
            {
              frameWidth: 32,
              frameHeight: 32,
              margin: 1,
              spacing: 2
            }
          );
    }

    preload() {
        this.loadPlayer();

        this.load.image('tiles', "../Resources/Subway_tiles.png");
        this.load.tilemapTiledJSON("spacesuitMap", '../Resources/spacesuitRoom.json');

        
    }

    createPlayer(map)
    {
        this.player = new TempPlayer(this, map.widthInPixels / 2, map.heightInPixels / 2);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }


    create() {
        // this.add.image(0, 0, 'tiles');
        this.physics.world.setBoundsCollision(true, true, true, true);
        const map = this.make.tilemap({ key: "spacesuitMap"});
        const tileset = map.addTilesetImage('Spaceship', 'tiles');

        this.background = map.createStaticLayer('Background', tileset);
        this.foreGround = map.createDynamicLayer('Foreground', tileset);
        this.decorations = map.createStaticLayer('decoration', tileset);

        this.background.setCollisionByProperty({collides: true});
        this.foreGround.setCollisionByProperty({collides: true});
        this.decorations.setCollisionByProperty({collides: true});

        // create the player
        this.createPlayer(map);
        this.player.sprite.setCollideWorldBounds(true);

        this.physics.world.addCollider(this.player.sprite, this.background);
        this.physics.world.addCollider(this.player.sprite, this.foreGround);
        this.physics.world.addCollider(this.player.sprite, this.decorations);
    }

    update(time, delta)
    {
        this.player.update();
    }
}