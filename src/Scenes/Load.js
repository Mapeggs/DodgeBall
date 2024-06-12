class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        
    }





    create() {


        //this helps connect with the other scene......
        this.scene.start("menuScene");
    }


    
    update() {
    }
}