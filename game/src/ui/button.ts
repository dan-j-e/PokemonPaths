import Phaser from 'phaser';

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Text {
  const button = scene.add
    .text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#3a3a5a',
      padding: { x: 12, y: 8 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onClick)
    .on('pointerover', () => button.setStyle({ backgroundColor: '#55558a' }))
    .on('pointerout', () => button.setStyle({ backgroundColor: '#3a3a5a' }));

  return button;
}
