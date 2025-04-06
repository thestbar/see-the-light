import { Game } from "../Game";
import { Fish } from "./Fish";

export class BigFish extends Fish {
    public static createBigFish(scene: Game): BigFish {
        const x = Phaser.Math.Between(10, scene.scale.width);
        const fish = new BigFish(scene, x, -10);

        return fish;
    }

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, 'big_fish');
    }

    create() {
        super.create();
        const velocityX = Phaser.Math.Between(-10, 10);
        const velocityY = Phaser.Math.Between(4, 8);
        this.initialVelocityY = velocityY;
        this.initialVelocityX = velocityX;
        this.animsLeft = 'big_fish_left';
        this.animsRight = 'big_fish_right';

        // // Fish moving left
        // if (velocityX < 0) {
        //     this.angle += 0.785; // 45 degrees
        // } else if (velocityX > 0) {
        //     this.angle -= 0.785; // -45 degrees
        // }

        this.setVelocityX(velocityX);
        this.setVelocityX(velocityY);
    }

    createAnimations() {
        if (!this.scene.anims.get('big_fish_left')) {
            this.scene.anims.create({
                key: 'big_fish_left',
                frames: this.scene.anims.generateFrameNumbers(this.spriteName, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.scene.anims.get('big_fish_right')) {
            this.scene.anims.create({
                key: 'big_fish_right',
                frames: this.anims.generateFrameNumbers(this.spriteName, { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }
}
