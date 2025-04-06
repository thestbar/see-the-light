import { Game } from "../Game";

export class Fish extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    spriteName: string;
    alreadyDamaged: boolean;
    initialVelocityX: number;
    initialVelocityY: number;
    animsLeft: string;
    animsRight: string;
    scene: Game;

    constructor(scene: Game, x: number, y: number, spriteName: string) {
        super(scene, x, y, spriteName);
        this.spriteName = spriteName;
        this.alreadyDamaged = false;
        this.scene = scene;
    }

    create() {
        this.scene.physics.world.enableBody(this);
        this.setBounce(0.2);
        this.setCollideWorldBounds(false);
        this.setOrigin(0.5, 0.5);
        this.setScale(1);
        this.createAnimations();
        this.setGravityY(0);

        this.scene.add.existing(this);
    }

    update() {
        if (!this.body) throw new Error('Body is not defined for fish');

        // If fish is moving right (x > 0), then flip the fish to the right.
        // If fish is moving left (x < 0), then flip the fish to the left.
        if (this.body.velocity.x > 0) {
            this.anims.play(this.animsRight, true);
        } else if (this.body.velocity.x < 0) {
            this.anims.play(this.animsLeft, true);
        }

        const fishShouldGoFaster = this.scene.player.cursors.up.isDown &&
            this.scene.player.energy > 0 &&
            this.scene.player.y < 0.33 * this.scene.scale.height;

        const fishShouldGoSlower = this.scene.player.y > 0.9 * this.scene.scale.height &&
            (!this.scene.player.cursors.up.isDown || this.scene.player.energy === 0)

        if (fishShouldGoFaster) {
            this.setVelocityY(this.initialVelocityY * 2);
        } else if (fishShouldGoSlower) {
            this.setVelocityY(this.initialVelocityY / 2);
        } else {
            this.setVelocityY(this.initialVelocityY);
        }

        this.setVelocityX(this.initialVelocityX);
    }

    createAnimations() {
        throw new Error('Method not implemented.');
    }
}
