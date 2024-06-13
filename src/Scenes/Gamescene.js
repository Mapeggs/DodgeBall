class Gamescene extends Phaser.Scene {
  constructor() {
      super("gameScene");
  }

  init() {
    this.player1Score = 0
    this.player2Score = 0
    this.gameOver = false
    this.scoreLimit = 3 // The winning score
  }

  create() {
    this.background = this.add.image(240, 160, 'menubackground').setScale(2.5);

    // Court lines
    this.add.line(0, 0, 490, 0, 490, 800, 0xffffff).setOrigin(0, 0); // Middle line
    this.add.rectangle(0, 0, 980, 800).setStrokeStyle(2, 0xffffff).setOrigin(0, 0); // Outer rectangle

    // Load characters
    this.player1 = this.physics.add.sprite(200, 400, 'char1').setScale(2);
    this.player2 = this.physics.add.sprite(780, 400, 'char2').setScale(2);

    // Set initial angles
    this.player1.angle = 0;
    this.player2.angle = 180;

    // Load balls
    this.balls = this.physics.add.group({
        key: 'ball',
        setXY: { x: 490, y:400, stepX: 0, stepY: 0 }
    });

    // Ball physics
    this.balls.children.iterate((ball) => {
        ball.setCollideWorldBounds(true);
        ball.setBounce(0, 0); // No bounce
        ball.setVelocity(0, 0);
        ball.body.moves = false; // Disable physics initially
        ball.heldBy = null; // No player is holding it
    });
    
    
    // Player physics
    this.player1.setCollideWorldBounds(true);
    this.player2.setCollideWorldBounds(true);

    // Player controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.WASD = this.input.keyboard.addKeys({up: 'W', down: 'S', left: 'A', right: 'D'});

    //player 1 pick-up E and throw SPACE
    this.pickupKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.throwKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //Player 2 pick-up K and throw L
    this.pickupKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.throwKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    // Use overlap instead of collider to manage ball pick up
    this.physics.add.overlap(this.balls, this.player1, this.checkOverlap, null, this);
    this.physics.add.overlap(this.balls, this.player2, this.checkOverlap, null, this);

// Commented out ball collision with players to prevent unwanted ball movement
// this.physics.add.collider(this.balls, this.player1, (ball, player) => this.hitPlayer(ball, player));
// this.physics.add.collider(this.balls, this.player2, (ball, player) => this.hitPlayer(ball, player));


    // Score display
    this.scoreText1 = this.add.text(16, 16, 'Player 1: ' + this.player1Score, { fontSize: '32px', fill: '#FFF' })
    this.scoreText2 = this.add.text(750, 16, 'Player 2: ' + this.player2Score, { fontSize: '32px', fill: '#FFF' })

    this.player1.hasBall = false;
    this.player2.hasBall = false;
}

  update() {
      if (this.gameOver) {
        return
      }
    
      // Player 1 & 2 movement
      this.handleMovement(this.player1, this.WASD, this.throwKey1, 'char1')
      this.handleMovement(this.player2, this.cursors, this.throwKey2, 'char2')
    
      // Update ball position while held
      if (this.player1.hasBall) {
        this.player1.ball.setPosition(this.player1.x, this.player1.y)
      }
      if (this.player2.hasBall) {
        this.player2.ball.setPosition(this.player2.x, this.player2.y)
      }
   }

  handleMovement(player, controls, throwKey, spriteKey) {
      if (controls.left.isDown) {
          player.setVelocityX(-160);
          player.angle = 180;
      } else if (controls.right.isDown) {
          player.setVelocityX(160);
          player.angle = 0;
      } else {
          player.setVelocityX(0);
      }
      if (controls.up.isDown) {
          player.setVelocityY(-160);
          player.angle = -90;
      } else if (controls.down.isDown) {
          player.setVelocityY(160);
          player.angle = 90;
      } else {
          player.setVelocityY(0);
      }

      if (player.hasBall) {
          player.ball.setPosition(player.x, player.y);
      }

      // Player throws ball
      if (Phaser.Input.Keyboard.JustDown(throwKey) && player.hasBall) {
          this.throwBall(player);
      }
  }

  checkOverlap(player, ball) {
      if ((player === this.player1 && Phaser.Input.Keyboard.JustDown(this.pickupKey1)) || 
          (player === this.player2 && Phaser.Input.Keyboard.JustDown(this.pickupKey2))) {
          this.pickUpBall(player, ball);
      }
  }

  pickUpBall(player, ball) {
      if (!player.hasBall) {
        ball.setVelocity(0, 0)
        ball.body.moves = false // Disable ball physics
        ball.heldBy = player // Mark ball as held by the player
        player.hasBall = true
        player.ball = ball
        ball.setVisible(true)
      }
    }
    
    

    throwBall(player) {
      let ball = this.balls.getFirstDead(true, player.x, player.y, 'ball');
  
      if (ball) {
          ball.setActive(true);
          ball.setVisible(true);
          ball.body.moves = true; // Enable ball physics
          ball.thrownBy = player;
          player.hasBall = false;
          player.ball = null;
  
          let velocity = 400; // Adjust this value as needed
          let angle = Phaser.Math.DegToRad(player.angle); // Convert angle to radians
  
          // Calculate velocity based on player angle
          let velocityX = velocity * Math.cos(angle);
          let velocityY = velocity * Math.sin(angle);
  
          ball.setVelocity(velocityX, velocityY);
  
          // Add collision detection for the thrown ball
          this.physics.add.collider(ball, this.player1, (b, p) => this.hitPlayer(b, p));
          this.physics.add.collider(ball, this.player2, (b, p) => this.hitPlayer(b, p));
  
          // Handle world bounds to deactivate the ball when it goes out of bounds
          ball.body.setCollideWorldBounds(true);
          ball.body.onWorldBounds = true;
          ball.body.world.on('worldbounds', () => {
              ball.setActive(false);
              ball.setVisible(false);
          });
      }
  }
  
  
    

  hitPlayer(ball, player) {
    if (ball.thrownBy && ball.thrownBy !== player) {
      ball.setVelocity(0, 0)
      ball.body.moves = false // Ensure the ball doesn't move
  
      if (ball.thrownBy === this.player1) {
        this.player1Score += 1
        this.scoreText1.setText('Player 1: ' + this.player1Score)
      } else if (ball.thrownBy === this.player2) {
        this.player2Score += 1
        this.scoreText2.setText('Player 2: ' + this.player2Score)
      }
  
      player.setVisible(false) // "Destroy" the player (make invisible)
      ball.thrownBy = null // Reset the thrower
      ball.setPosition(490, 400) // Reset ball position
  
      // Check if a player has won
      if (this.player1Score >= this.scoreLimit || this.player2Score >= this.scoreLimit) {
        this.gameOver = true
        this.endGame()
      } else {
        // Reset player positions and ball for the next round
        this.resetRound()
      }
    }
  }
  
resetRound() {
  // Reset player positions
  this.player1.setPosition(200, 400).setVisible(true)
  this.player2.setPosition(780, 400).setVisible(true)

  // Reset ball positions
  this.balls.children.iterate((ball) => {
    ball.setPosition(490, 400)
    ball.setVelocity(0, 0)
    ball.body.moves = false
    ball.heldBy = null
  })

  // Ensure players are not holding any balls
  this.player1.hasBall = false
  this.player2.hasBall = false
}  
    

endGame() {
    let winnerText = this.player1Score >= this.scoreLimit ? 'Player 1 Wins!' : 'Player 2 Wins!'
    this.add.text(490, 400, winnerText, { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5, 0.5)
  
    // Add a prompt to press SPACE to restart
    this.add.text(490, 480, 'Press SPACE to Restart', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5, 0.5)
  
    // Listen for the SPACE key to restart the game
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  
    this.spaceKey.on('down', () => {
      this.scene.restart()
    })
  }
  
}