import { Game } from './engine/Game.js';

window.addEventListener('load', () => {
    console.log("Quantum Cricket 2026 Initializing...");
    const game = new Game();
    // game.start(); // Removed auto-start

    window.startGame = () => {
        document.getElementById('start-screen').style.display = 'none';
        game.start();

        // Resume Audio Context on user gesture
        if (game.sound && game.sound.ctx.state === 'suspended') {
            game.sound.ctx.resume();
        }
    };

    window.triggerSwing = (dir) => {
        if (game.gameState === 'PLAYING') {
            game.batting.swing(dir);
        }
    };
});
