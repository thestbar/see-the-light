import { Fish } from "./Fish";

export class Player extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    energy: number;
    maxEnergy: number;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    xDirection: number;
    currentDepth: number;
    maxDepth: number;
    prevX: number | null;
    prevY: number | null;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
    }

    create() {
        this.scene.physics.world.enableBody(this);
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 0.5);
        this.setScale(1);
        this.createAnimations();
        this.speed = 12;
        // this.speed = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.xDirection = 1;
        this.currentDepth = 2000;
        this.maxDepth = 2200;
        this.prevX = null;
        this.prevY = null;

        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input not available');
        }

        this.cursors = keyboard.createCursorKeys();
        this.scene.add.existing(this);
    }

    update(time: number, delta: number) {
        if (this.cursors.left.isDown) {
            this.xDirection = -1;
            this.setVelocityX(this.xDirection * this.speed);
            this.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.xDirection = 1;
            this.setVelocityX(this.xDirection * this.speed);
            this.anims.play('right', true);
        }
        else {
            this.setVelocityX(this.xDirection * this.speed / 2);
            this.setVelocityY(this.scene.physics.world.gravity.y);
            if (!this.body) throw new Error('Player body not found');
            if (this.body.velocity.x > 0) {
                this.anims.play('right', true);
            } else {
                this.anims.play('left', true);
            }
        }

        if (this.cursors.up.isDown && this.energy > 0) {
            // In case player is at the height / 3 of the screen, then do not
            // allow to go up.
            if (this.y < 0.33 * this.scene.scale.height) {
                this.setVelocityY(0);
            } else {
                this.setVelocityY(-2 * this.speed);
            }
            // Reduce energy
            this.energy -= 0.02 * delta;
        } else if (this.y > 0.9 * this.scene.scale.height) {
            // In case player is at the 0.8 * height of the screen, then do not
            // allow to go down.
            this.setVelocityY(0);
        }

        if (!this.cursors.up.isDown) {
            // Increase energy
            if (this.energy < this.maxEnergy) {
                this.energy += 0.004 * delta;
            }
        }
        if (this.energy < 0) {
            this.energy = 0;
        } else if (this.energy > this.maxEnergy) {
            this.energy = this.maxEnergy;
        }
        this.calculateDepth(delta);
    }

    postupdate() {
        // Last thing before going to the next frame
        // Save the current position of the player
        this.prevX = this.x;
        this.prevY = this.y;
    }

    getPrevPosition(): { x: number, y: number } {
        if (this.prevX === null || this.prevY === null) {
            throw new Error('Previous position not set');
        }
        return { x: this.prevX, y: this.prevY };
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    calculateDepth(deltaTime: number) {
        if (!this.body) throw new Error('Player body not found');

        if (this.cursors.up.isDown && this.energy > 0 && this.body.deltaY() >= 0) {
            this.currentDepth -= deltaTime * 0.001 * this.speed;

            return;
        }

        if (!this.cursors.up.isDown && this.y > 0.7 * this.scene.scale.height && this.body.deltaY() >= 0) {
            this.currentDepth += deltaTime * this.scene.physics.world.gravity.y * 0.0005 * this.speed;

            return;
        }

        this.currentDepth += this.body.deltaY() * 0.5;
    }

    getCurrentDepth() {
        return this.currentDepth;
    }
}
