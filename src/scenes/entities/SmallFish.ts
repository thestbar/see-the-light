import { Game } from "../Game";
import { Fish } from "./Fish";

export class SmallFish extends Fish {
    public static createSmallFish(scene: Game): SmallFish {
        const x = Phaser.Math.Between(10, scene.scale.width);
        const fish = new SmallFish(scene, x, -10);

        return fish;
    }

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, 'small_fish');
    }

    create() {
        super.create();
        const velocityX = Phaser.Math.Between(-4, 4);
        const velocityY = Phaser.Math.Between(4, 15);
        this.initialVelocityY = velocityY;
        this.initialVelocityX = velocityX;
        this.animsLeft = 'small_fish_left';
        this.animsRight = 'small_fish_right';

        this.setVelocityX(velocityX);
        this.setVelocityX(velocityY);
    }

    createAnimations() {
        if (!this.scene.anims.get('small_fish_left')) {
            this.scene.anims.create({
                key: 'small_fish_left',
                frames: this.scene.anims.generateFrameNumbers(this.spriteName, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.scene.anims.get('small_fish_right')) {
            this.scene.anims.create({
                key: 'small_fish_right',
                frames: this.anims.generateFrameNumbers(this.spriteName, { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }
}
