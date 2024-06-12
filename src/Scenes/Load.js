class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load assets for the menu
        this.load.image('menubackground', 'menubackground.png');
        this.load.image('greyButton', 'grey_button.png');

        // Load individual assets
        this.load.image('char1', 'char1.png');
        this.load.image('char2', 'char2.png');
        this.load.image('ball', 'ball.png');
    }

    create() {
        // Switch to the menu scene
        this.scene.start("menuScene");
    }

    update() {
    }
}
