export default class SceneOne extends Phaser.Scene{
    constructor()
    {
        super("Scene One")
    }

    preload()
    {
        this.load.image('Background', "Assets/Scene1.png");
        this.load.audio('musics1', ['Assets/lemoyne.mp3']);
        this.load.audio('disco', ['Assets/disco.mp3']);
    }

    create()
    {
        this.levelMusic = this.sound.add('musics1', {volume: .7, loop: true});
        this.discoMusic = this.sound.add('disco', {volume: 1.1});
        this.levelMusic.play();

        // draw the background of the scene
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const characterY = screenCenterY;
        const spaceManX = screenCenterX * .45;
        const blueX = screenCenterX * 1.1;
        const blueY = characterY * 1.1;

        const discoX = screenCenterX * 1.25;

        const background = this.add.image(screenCenterX, screenCenterY, 'Background');
        background.setScale(.35);
        this.cameras.main.setBackgroundColor(0,0, 0)
        this.cameras.main.fadeIn(3000);

        this.spaceman = this.add.text(spaceManX, characterY, "",{ font: "Roboto Condensed",
        fontsize: '10px', pixelart: true, align: 'center'});
        this.blue = this.add.text(blueX, blueY, "",{ font: "Roboto Condensed",
        fontsize: '10px', pixelart: true, color: '#77f', align: 'center'});
        this.disco = this.add.text(discoX, characterY * .7, "",{ font: "Roboto Condensed",
        fontsize: '10px', pixelart: true, color: '#f7f', align: 'center'});

        setTimeout(() => this.StartTextOne(), 5000);
    }

    ResetText()
    {
        this.spaceman.setText("");
        this.blue.setText("");
        this.disco.setText("");
    }

    StartTextOne()
    {
        this.spaceman.setText("Howdy Fellas.");
        setTimeout(() => this.e2(), 3000);
    }

    e2()
    {
        this.ResetText();
        this.blue.setText("I'm blue...");
        setTimeout(() => this.e3(), 4000)
    }

    e3()
    {
        this.ResetText();
        this.spaceman.setText("Now why would that be?");
        setTimeout(() => this.e4(), 3000);
    }

    e4()
    {
        this.ResetText();
        this.levelMusic.pause();
        this.discoMusic.play();
        this.disco.setText("His friend, like,\n totally,\n fell up the\ngravity chamber.");
        setTimeout(() => this.e5(), 5000);
    }

    e5()
    {
        this.ResetText();
        this.discoMusic.pause();
        this.levelMusic.play();
        this.spaceman.setText("Fell UP?");
        setTimeout(() => this.e6(), 2000);
    }

    e6()
    {
        this.ResetText();
        this.levelMusic.pause();
        this.discoMusic.play();
        this.disco.setText("Yeah, you know.\nIf you know,\nyou know.");
        setTimeout(() => this.e7(), 4000);
    }

    e7()
    {
        this.disco.setText("Quit steppin on my\nblue suede shoes dude\n");
        setTimeout(() => this.e8(), 5000);
    }

    e8()
    {
        this.disco.setText("Like, you pretending\nto not know what\nfalling up means\n");
        setTimeout(() => this.e9(), 6000);
    }

    e9()
    {
        this.disco.setText("Is totally not\nSaturday Night Fever\nvibes!");
        setTimeout(() => this.e10(), 10000);
    }

    e10()
    {
        this.ResetText();
        this.discoMusic.pause();
        this.levelMusic.play();
        this.spaceman.setText("Ok \"dude\"\n I'll see what\nI can do.");
        setTimeout(() => this.e11(), 6000);
    }

    e11()
    {
        this.ResetText();
        this.cameras.main.fadeOut(4000);
        var exgame = this.game;
        this.cameras.main.once('camerafadeoutcomplete', function(camera) {
            exgame.scene.start("Main Scene");
        });
    }
}