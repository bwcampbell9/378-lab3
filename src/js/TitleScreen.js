export default class TitleScreen extends Phaser.Scene{
    constructor()
    {
        super("Title Screen");
    }

    preload()
    {
        this.load.image('BryceJohn', 'Assets/Intro.png');
        this.load.image('Art Credits', 'Assets/credits.png');
        this.load.image('Title', 'Assets/IntroText.png');
        this.load.audio('music', ['Assets/title-music.mp3']);
        this.load.audio('playsound', ['Assets/play_sound.mp3']);
        this.load.spritesheet("player_idle2", "../Assets/astronautIDLE_big.png", { frameWidth: 64, frameHeight: 72 });
        this.load.image('play', "Assets/PLAYTEXT.png");
        this.load.image('creditsbutton', "Assets/CreditsButton.png");
    }

    create()
    {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2; 
        const topLeftX = this.cameras.main.worldView.x + this.cameras.main.width / 2.5;
        const topLeftY = this.cameras.main.worldView.y +  this.cameras.main.height / 2; 

        const bottomRightX = this.cameras.main.worldView.x + this.cameras.main.width / 1.15;
        const bottomRightY = this.cameras.main.worldView.y +  this.cameras.main.height / 2; 

        const bryceJohn = this.add.image(screenCenterX, screenCenterY, 'BryceJohn');
        const artCredits = this.add.image(screenCenterX, screenCenterY, 'Art Credits');
        const introText = this.add.image(topLeftX, topLeftY, 'Title');
        this.titlemusic = this.sound.add('music');
        this.playSound = this.sound.add('playsound');
        this.titlemusic.play();
        this.playersprite = this.add.sprite(bottomRightX, bottomRightY, 'player_idle2');
        var pSprite = this.playersprite;
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player_idle2', {start: 0, end: 8}),
            frameRate: 5,
            repeat: -1
        });
        this.playersprite.anims.play('idle', true);
        this.playersprite.setScale(2);
        this.playersprite.alpha = 0.0;
        const btnPlay = this.add.image(topLeftX, bottomRightY, 'play');
        this.playButton = btnPlay;
        btnPlay.setInteractive()
        .on('pointerdown', () => this.nextLevel());

        const creditsButton = this.add.image(topLeftX / 4, bottomRightY * 1.8, 'creditsbutton');
        this.creditsButton = creditsButton;
        creditsButton.setInteractive().on('pointerdown', () => this.showCredits());


        // scale the intro text
        btnPlay.setScale(.4);
        creditsButton.setScale(.4);
        bryceJohn.setScale(.4);
        artCredits.setScale(.4);
        introText.setScale(.3);

        bryceJohn.alpha = 1.0;
        creditsButton.alpha = 0.0;
        artCredits.alpha = 0.0;
        btnPlay.alpha = 0.0;
        introText.alpha = 0.0;
        this.cameras.main.fadeIn(4000);
        this.cameras.main.once('camerafadeincomplete', function(camera) {
            camera.fadeOut(4000);
            camera.once('camerafadeoutcomplete', function(camera) {
                bryceJohn.alpha = 0.0;
                artCredits.alpha = 1.0;
                camera.fadeIn(3000);
                camera.once('camerafadeincomplete', function(camera) {
                    camera.fadeOut(3500);
                    camera.once('camerafadeoutcomplete', function(camera) {
                        artCredits.alpha = 0.0;
                        introText.alpha = 1.0;
                        pSprite.alpha = 1.0;
                        btnPlay.alpha = 1.0;
                        creditsButton.alpha = 1.0;
                        camera.fadeIn(800);
                    })
                })
            })
        });
    }

    nextLevel()
    {
        this.playButton.removeInteractive();
        this.sound.stopAll();
        this.playSound.play();
        this.cameras.main.fadeOut(2000);
        
        var exgame = this.game;
        this.cameras.main.once('camerafadeoutcomplete', function(camera) {
            exgame.scene.start("Scene One");
        })
    }

    showCredits()
    {
        this.creditsButton.removeInteractive();
        this.add.text(this.creditsButton.x * .5, this.creditsButton.y * .7,
            "Music: Slinger's Song from \"Bastion\" - Sadness : Pixel Beats\nLemoyne - Red Dead Redemption 2\nRetro TV - Friday Night (Chiptune Cover)\nTiles: https://bakudas.itch.io/generic-run-n-gun",
             { font: "Roboto Condensed",
                fontsize: '12px'});
        this.creditsButton.destroy();
    }
}