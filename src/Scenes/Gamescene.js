class Gamescene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        // Court lines
        this.add.line(0, 0, 490, 0, 490, 800, 0xffffff).setOrigin(0, 0); // Middle line
        this.add.rectangle(0, 0, 980, 800).setStrokeStyle(2, 0xffffff).setOrigin(0, 0); // Outer rectangle

        // Load characters
        this.player1 = this.physics.add.sprite(200, 400, 'char1').setScale(2);
        this.player2 = this.physics.add.sprite(780, 400, 'char2').setScale(2);

        // Load balls
        this.balls = this.physics.add.group({
            key: 'ball',
            repeat: 2,
            setXY: { x: 490, y: 300, stepX: 0, stepY: 200 }
        });

        // Ball physics
        this.balls.children.iterate((ball) => {
            ball.setCollideWorldBounds(true);
            ball.setBounce(0, 0); // No bounce
            ball.setVelocity(0, 0);
        });

        // Player physics
        this.player1.setCollideWorldBounds(true);
        this.player2.setCollideWorldBounds(true);

        // Player controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.WASD = this.input.keyboard.addKeys({up: 'W', down: 'S', left: 'A', right: 'D'});
        this.pickupKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.throwKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pickupKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CONTROL);
        this.throwKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Collision detection
        this.physics.add.overlap(this.balls, this.player1, this.pickUpBall, null, this);
        this.physics.add.overlap(this.balls, this.player2, this.pickUpBall, null, this);
        this.physics.add.collider(this.balls, this.player1, this.hitPlayer, null, this);
        this.physics.add.collider(this.balls, this.player2, this.hitPlayer, null, this);

        // Score display
        this.scoreText1 = this.add.text(16, 16, 'Player 1: 0', { fontSize: '32px', fill: '#FFF' });
        this.scoreText2 = this.add.text(750, 16, 'Player 2: 0', { fontSize: '32px', fill: '#FFF' });

        this.player1.hasBall = false;
        this.player2.hasBall = false;
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Player 1 movement
        this.handleMovement(this.player1, this.WASD, this.throwKey1, 'char1');
        this.handleMovement(this.player2, this.cursors, this.throwKey2, 'char2');
    }

    handleMovement(player, controls, throwKey, spriteKey) {
        if (controls.left.isDown) {
            player.setVelocityX(-160);
            player.angle = -90;
        } else if (controls.right.isDown) {
            player.setVelocityX(160);
            player.angle = 90;
        } else {
            player.setVelocityX(0);
        }
        if (controls.up.isDown) {
            player.setVelocityY(-160);
            player.angle = 0;
        } else if (controls.down.isDown) {
            player.setVelocityY(160);
            player.angle = 180;
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

    pickUpBall(player, ball) {
        if ((player === this.player1 && Phaser.Input.Keyboard.JustDown(this.pickupKey1)) || 
            (player === this.player2 && Phaser.Input.Keyboard.JustDown(this.pickupKey2))) {
            if (!player.hasBall) {
                ball.setVelocity(0, 0);
                ball.x = player.x;
                ball.y = player.y;
                player.hasBall = true;
                player.ball = ball;
                ball.setVisible(false); // Hide the ball until it is thrown
            }
        }
    }

    throwBall(player) {
        let velocity = 400;
        let angle = player.angle;
        let ball = player.ball;

        if (angle === 0) {
            ball.setVelocity(0, -velocity);
        } else if (angle === 90) {
            ball.setVelocity(velocity, 0);
        } else if (angle === 180) {
            ball.setVelocity(0, velocity);
        } else if (angle === -90) {
            ball.setVelocity(-velocity, 0);
        }

        ball.setVisible(true); // Show the ball when it is thrown
        ball.thrownBy = player;
        player.hasBall = false;
        player.ball = null;
    }

    hitPlayer(ball, player) {
        if (ball.thrownBy && ball.thrownBy !== player) {
            ball.setVelocity(0, 0);

            if (ball.thrownBy === this.player1) {
                this.player1Score += 1;
                this.scoreText1.setText('Player 1: ' + this.player1Score);
            } else if (ball.thrownBy === this.player2) {
                this.player2Score += 1;
                this.scoreText2.setText('Player 2: ' + this.player2Score);
            }

            ball.thrownBy = null; // Reset the thrower
            ball.setPosition(490, 400); // Reset ball position

            if (this.player1Score === 3 || this.player2Score === 3) {
                this.gameOver = true;
                this.endGame(ball.thrownBy);
            }
        }
    }

    endGame(winningPlayer) {
        let winnerText = winningPlayer === this.player1 ? 'Player 1 Wins!' : 'Player 2 Wins!';
        this.add.text(490, 400, winnerText, { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown', () => {
            this.scene.restart();
        });
    }
}
