import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor() {
        super('GameOver');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000010);

        this.background = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        );

        this.background.setAlpha(0.01);

        this.addText(
            null,
            this.scale.height / 4,
            'You have reached the very depths of the ocean...',
            null,
            null,
            null
        );

        this.addText(
            null,
            this.scale.height / 2,
            'Left click to go the main menu',
            null,
            null,
            null
        );

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
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
            wordWrap: { width: this.scale.width, useAdvancedWrap: true },
        }).setOrigin(0.5);
    };
}
