class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }


    create() {
        this.background = this.add.image(240, 160, 'menubackground').setScale(2.5);
        let menuConfig = {
            fontFamily: 'Pixelify Sans',
            fontSize: '100px',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        //Title of Game
        this.add.text(350,20, "DODGE",menuConfig);
        menuConfig.color='#000000';
        menuConfig.fontSize=75;

        // Add the  play button
        this.playButton = this.add.image(500, 400, "greyButton").setScale(2.5).setInteractive();

        this.add.text(420, 365, "PLAY", menuConfig);


        
        this.playButton.on('pointerdown', () => {
            this.scene.start('gameScene')  // Replace 'gameScene' with the key of your main game scene
          })
      

    }    

    
    update() {

    }
}