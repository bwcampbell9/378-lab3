export default class EndLevel extends Phaser.Scene {
    constructor(tilesetPath="../Resources/Subway_tiles.png", 
                tilesetName="Spaceship",
                tilemapPath="../Resources/spaceShipLarge.json",
                sceneName="End Scene")
                {
                    super(sceneName);
                }
        
    create()
    {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const loadingText = this.add.text(screenCenterX, screenCenterY, 'You Win!').setOrigin(0.5);
    }
}