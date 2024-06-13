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

        let instructConfig = {
            fontFamily: 'Retro',
            fontSize: '40px',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.add.text(350,20, "DODGE",menuConfig);
        menuConfig.color='#000000';
        menuConfig.fontSize=75;


        this.playButton = this.add.image(500, 400, "greyButton").setScale(2.5).setInteractive();

        this.add.text(420, 365, "PLAY", menuConfig);

        this.add.text(325, 500, "P1 - WASD to Move,", instructConfig);
        this.add.text(260, 550, "E to Pickup, SPACE to Throw", instructConfig);
        this.add.text(340, 625, "P2 - <> to Move,", instructConfig);
        this.add.text(290, 675, "K to Pickup, L to Throw", instructConfig);


        
        this.playButton.on('pointerdown', () => {
            this.scene.start('gameScene') 
          })
      

    }    

    
    update() {

    }
}