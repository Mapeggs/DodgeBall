class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

         // Load assets for the menu
        this.load.image('Menubackground','menubackground.png');
        this.load.image('Greybutton','grey_button.png')

        // Load assets for the tilemap

        // Load charcter assets

        // Load character equipment assets

        
    }





    create() {


        //this helps connect with the other scene......
        this.scene.start("menuScene");
    }


    
    update() {
    }
}