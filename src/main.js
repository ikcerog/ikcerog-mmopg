import { Game } from './Game.js';

let game;

window.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing game...');
        game = new Game();
        await game.init();
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('loading-text').textContent =
            'Error loading game. Check console for details.';
        document.getElementById('loading-text').style.color = '#ff4444';
    }
});

window.addEventListener('resize', () => {
    if (game) {
        game.onResize();
    }
});
