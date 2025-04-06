import { Scene } from 'phaser';
import { Player } from './entities/Player';
import { SmallFish } from './entities/SmallFish';
import { Fish } from './entities/Fish';
import { BigFish } from './entities/BigFish';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    player: Player;
    bottomOfTheOcean: Phaser.GameObjects.Sprite;
    depthText: Phaser.GameObjects.Text;
    energyText: Phaser.GameObjects.Text;
    smallFish: Phaser.GameObjects.Group;
    bigFish: Phaser.GameObjects.Group;

    constructor() {
        super('Game');
    }

    create() {
        this.sound.stopAll();
        const music = this.sound.add('ambient');
        music.setLoop(true);
        music.setVolume(0.2);
        music.play();

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000010);

        this.background = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        );
        this.background.setAlpha(0.5);

        this.createBottomOfTheOcean();

        this.player = new Player(this, 40, 40);
        this.player.create();
        this.events.on('postupdate', this.postupdate, this);

        this.smallFish = this.physics.add.group({
            classType: SmallFish,
            runChildUpdate: true,
        });
        this.bigFish = this.physics.add.group({
            classType: BigFish,
            runChildUpdate: true,
        });

        // Add collisions (we need only overlaps)
        this.physics.add.collider(this.player, this.smallFish, this.playerEatFish, undefined, this);
        this.physics.add.overlap(this.player, this.bigFish, this.fishDamagePlayer, undefined, this);


        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
        this.createUi();
    }

    update(time: number, delta: number) {
        if (this.player.getCurrentDepth() > this.player.maxDepth) {
            this.sound.play('gameover');
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.scene.start('GameOver');
        }
        if (this.player.getCurrentDepth() <= 0) {
            this.sound.play('win');
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.scene.start('WinScreen');
        }

        this.player.update(time, delta);
        this.updateUi();
        this.calculateOceanColor();

        // Randomly create small fish
        if (Math.random() < 0.01) {
            const smallFish = SmallFish.createSmallFish(this);
            smallFish.create();
            this.smallFish.add(smallFish);
        }

        // Randomly create big fish
        if (Math.random() < 0.005) {
            const bigFish = BigFish.createBigFish(this);
            bigFish.create();
            this.bigFish.add(bigFish);
        }

        // Update all fish
        this.smallFish.children.iterate((fish: SmallFish) => {
            fish.update();
        });

        this.bigFish.children.iterate((fish: BigFish) => {
            fish.update();
        });
    }

    postupdate() {
        this.player.postupdate();

        // Destroy fish that are out of bounds
        this.smallFish.children.iterate((fish: SmallFish) => {
            if (fish && fish.y > this.scale.height + 20) {
                fish.destroy();
            }
        });
        this.bigFish.children.iterate((fish: BigFish) => {
            if (fish && fish.y > this.scale.height + 20) {
                fish.destroy();
            }
        });
    }

    createBottomOfTheOcean() {
        this.bottomOfTheOcean = this.add.sprite(0, 168, '');
        this.bottomOfTheOcean.scaleX = 124;
        this.bottomOfTheOcean.scaleY = 0.1;
    }

    createUi() {
        this.depthText = this.addText(null, 8, `${this.playerDepth()}m`, null, null, null);
        this.energyText = this.addText(null, 150, `${this.playerEnergy()}m`, null, null, null);
    }

    updateUi() {
        this.depthText.setText(`${this.playerDepth()}m`);
        this.energyText.setText(`${this.playerEnergy()}`);
    }

    playerDepth() {
        return Math.floor(this.player.getCurrentDepth());
    }

    playerEnergy() {
        if (this.player.energy == 0) return 0;

        return Math.ceil(this.player.energy);
    }

    updateCamera() {
        // Top of the screen is 0 pixels.
        //
        // The bottom of the screen is 160 pixels (or to keep it generic,
        // the height of the screen).
        //
        // When the player is at the 0.2 * height of the screen and players depth
        // is bigger than 40, the camera and the background should move up at the
        // same speed as the player.
        //
        // When the player is at the 0.8 * height of the screen and players depth
        // is smaller than 4500, the camera and the background should move down
        // at the same speed as the player.

        const playerYPercentage = this.player.y / this.scale.height;
        const playerDepth = this.player.getCurrentDepth();
        try {
            if (!this.player.body) throw new Error('Player body not found');
            const delta = this.player.body.deltaY();
            if (playerYPercentage < 0.35 && playerDepth > 40) {
                this.camera.y -= delta;
                this.background.y -= delta;
            } else if (playerYPercentage > 0.7 && playerDepth < 4500) {
                this.camera.y -= delta;
                this.background.y -= delta;
            }
        } catch (e) {
            console.log('Error getting previous position:', e);
        }

    }

    // Calculate the ocean alpha based on the depth of the player.
    // The deeper the player is, the darker the ocean should be.
    // The ocean should be a gradient from light blue to dark blue.
    calculateOceanColor() {
        const depth = this.player.getCurrentDepth();
        const ratio = 1 - depth / this.player.maxDepth;
        this.background.setAlpha(ratio);
    }

    addText(
        x: number | null,
        y: number,
        text: string,
        fontSize: string | null,
        color: string | null,
        align: string | null
    ) {
        const realX = x || this.scale.width / 2;
        const realFontSize = fontSize || '8px';
        const realColor = color || '#ffffff';
        const realAlign = align || 'center';

        return this.add.text(realX, y, text, {
            fontFamily: 'PressStart2P',
            fontSize: realFontSize,
            color: realColor,
            align: realAlign,
        }).setOrigin(0.5);
    };

    playerEatFish(player: Player, fish: Fish) {
        // Remove the fish from the scene
        fish.destroy();

        // Increase the player's energy
        player.energy += 50;

        // Play sfx
        this.sound.play('eat');
    }

    fishDamagePlayer(player: Player, fish: Fish) {
        if (fish.alreadyDamaged) return;

        // Increase the player's energy
        player.energy -= 20;
        fish.alreadyDamaged = true;

        // Play sfx
        this.sound.play('hurt');
    }
}
