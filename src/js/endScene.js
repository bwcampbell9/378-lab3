export default class EndScene extends Phaser.Scene {
    constructor()
    {
        super("End Scene")
    }

    preload()
    {
        this.load.image('BackgroundSpace', "Assets/stars.png");
        this.load.image("astronaut", "Assets/astronautOneFrame.png");
        this.load.image("clown", "Assets/clownguy.png");
        this.load.audio('clownHonk', ['Assets/clownhorn.mp3']);
        this.load.audio('sad', ['Assets/Sadness.mp3']);
    }

    create()
    {
        this.game.sound.stopAll();
        this.clownHonk = this.sound.add('clownHonk', {volume: .4});
        this.sadMusic = this.sound.add('sad', {volume: 1.0});
        this.sadMusic.play();

        // draw the background of the scene
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.centerX = screenCenterX;
        this.centerY = screenCenterY;

        const characterY = screenCenterY;
        this.initialY = characterY;
        const spaceManX = screenCenterX * .45;
        const clownX = screenCenterX * 1.5;

        const characterTextY = characterY;

        const background = this.add.image(screenCenterX, screenCenterY, 'BackgroundSpace');
        this.background = background;
        // add in character images
        this.spacemanimage = this.add.image(spaceManX, characterY, 'astronaut');
        this.clownImage = this.add.image(clownX, characterY, 'clown');

        this.spacemanimage.setScale(2.0);
        this.clownImage.setScale(2.0);
        background.setScale(.2);
        this.cameras.main.setBackgroundColor(0, 0, 0)
        this.cameras.main.fadeIn(4000);



        this.spaceman = this.add.text(spaceManX * .9, characterTextY, "",{ font: "Roboto Condensed",
        fontsize: '10px', pixelart: true, align: 'center'});
        this.clown = this.add.text(clownX * .9, characterTextY, "",{ font: "Roboto Condensed",
        fontsize: '10px', pixelart: true, color: '#F66', align: 'center'});

        setTimeout(() => this.StartTextOne(), 5000);
    }

    update(time, delta)
    {
        this.spacemanimage.y = Math.sin(time / 1000) * 2 + this.initialY;
        this.clownImage.y = Math.cos(time / 1000) * 2 + this.initialY;
        this.spaceman.y = this.spacemanimage.y * .4;
        this.clown.y = this.clownImage.y * .4;
    }

    ResetText()
    {
        this.spaceman.setText("");
        this.clown.setText("");
    }

    StartTextOne()
    {
        this.spaceman.setText("How in tarnation\ndid you get here?");
        setTimeout(() => this.e1(), 3000);
    }

    e1()
    {
        this.ResetText();
        setTimeout(() => this.e2(), 4000);
    }

    e2()
    {
        this.spaceman.setText("Hello?");
        setTimeout(() => this.e3(), 3000);
    }

    e3()
    {
        this.ResetText();
        setTimeout(() => this.e4(), 1000);
    }

    e4()
    {
        this.ResetText();
        this.clown.setText("hey...");
        this.clownHonk.play();
        setTimeout(() => this.e5(), 4000);
    }

    e5()
    {
        this.ResetText();
        this.clown.setText("you can go back now...");
        this.clownHonk.play();
        setTimeout(() => this.e6(), 4000);
    }

    e6()
    {
        this.ResetText();
        this.spaceman.setText('What do you mean?');
        setTimeout(() => this.e7(), 3000);
    }

    e7()
    {
        this.ResetText();
        this.clown.setText('No one takes me\nseriously anymore.');
        this.clownHonk.play();
        setTimeout(() => this.e8(), 3000);
    }

    e8()
    {
        this.ResetText();
        this.spaceman.setText("That's ok!\nYour pals are waiting!");
        setTimeout(() => this.e9(), 3000);
    }

    e9()
    {
        this.ResetText();
        this.clown.setText('They are???');
        this.clownHonk.play();
        setTimeout(() => this.e10(), 3000);
    }

    e10()
    {
        this.ResetText();
        this.spaceman.setText("Yeah buddy,\nLets go home.");
        this.cameras.main.fadeOut(6000);
        var s = this;
        this.cameras.main.once('camerafadeoutcomplete', function(camera) {
            s.background.alpha = 0.0;
            s.spacemanimage.alpha = 0.0;
            s.spaceman.setText("");
            s.clownImage.alpha = 0.0;
            s.add.text(this.centerX, this.centerY, "The End.",{ font: "Roboto Condensed",
                fontsize: '40px', pixelart: true, color: '#FFF', align: 'center'});
            camera.fadeIn(5000);
        })
        
    }
}